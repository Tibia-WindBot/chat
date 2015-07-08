var crypto = require('crypto');
var moment = require('moment');
var debug = require('debug')('vbauth');
var mysql = require('mysql');
var async = require('async');
var objectAssign = require('object-assign');

debug('Initializing vbauth');

// A default user object
var defaultUserObject = {
	userid: 0,
	username: 'unregistered',
	usergroupid: 1,
	membergroupids: '',
	email: '',
	posts: 0
};

module.exports = function(database, options) {
	var module = {};

	options = objectAssign({
		// Used to salt the remember me password before setting the cookie.
		// The cookieSalt is located at the file 'includes/functions.php' of your vBulletin install
		cookieSalt: "QS43E7xAe^vXu1nLhZjpUz51rb1@fwyP^mfl3VFI",

		// Cookie prefix used by vBulletin. Defaults to 'bb_'.
		cookiePrefix: "bb_",

		// How long it takes for a session to timeout.
		cookieTimeout: 900,

		// Cookie domain.
		cookieDomain: '',

		// Default path, for activity refresh. Set a url, or null. null defaults to req.path
		defaultPath: 'http://my.domain.com',

		// The strike system will block the user from trying to log in after 5 wrong tries
		useStrikeSystem: true,

		// Should it refresh activity or not? If not, it will simply attach the userinfo to the
		// request object, and will not make any writes or updates in to the Forum database
		refreshActivity: true,

		// Use Secure cookies for remember me. Secure cookies only gets stored if transmitted
		// via TLS/SSL (https sites)
		secureCookies: true
	},
	options);

	if (!database) {
		throw new Error('You must pass the database information on vbauth initialization');
	} else if (database.hasOwnProperty('connectionLimit') &&
			database.hasOwnProperty('host') &&
			database.hasOwnProperty('user') &&
			database.hasOwnProperty('password') &&
			database.hasOwnProperty('database')) {
		database = mysql.createPool(database);
	} else if (!database.hasOwnProperty('config')) {
		throw new Error('Invalid MySQL info passed on vbauth initialization');
	}

	// Removes ipv6 from req.ip
	function getIp(req) {
		var ip = req.ip || '';
		return ip.slice(ip.lastIndexOf(':') + 1);
	}

	// Unique id based on user ip and user agent
	function fetchIdHash(req) {
		var ip = req.ip;
		ip = ip.slice(ip.lastIndexOf(':') + 1, ip.lastIndexOf('.'));

		return crypto.createHash('md5')
			.update(req.header('user-agent') + ip)
			.digest('hex');
	}

	// Create a new session in the database for the user
	function createSession(req, res, userid, callback) {
		var hash = moment().valueOf().toString() + userid + getIp(req);
		hash = crypto.createHash('md5')
			.update(hash)
			.digest('hex');
		var url = (options.defaultPath ? options.defaultPath : req.path);

		// Sets cookie to the response
		res.cookie(options.cookiePrefix + 'sessionhash', hash, { httpOnly: true });

		var query = mysql.format(
			'INSERT INTO session' +
			' (userid, sessionhash, host, idhash, lastactivity, location, useragent, loggedin)' +
			' VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
				userid,
				hash,
				getIp(req),
				fetchIdHash(req),
				moment().unix(),
				url,
				req.header('user-agent').slice(0, 100),
				(userid > 0)
			]
		);

		database.query(query, function(err, rows) {
			if (err) {return callback(err, null);}

			callback(null, hash);
		});
	}

	// Refreshes the user activity in the database, according to its session
	function updateUserActivity(lastUrl, userid, sessionHash, callback) {
		var values = [moment().unix(), lastUrl, userid, (userid > 0), sessionHash];
		var query = mysql.format(
			'UPDATE session SET lastactivity = ?, location = ?, userid = ?, loggedin = ? WHERE sessionhash = ?', values
		);

		database.query(query, function(err, result) {
			if (err) {return callback(err, null);}

			callback(null, (result.affectedRows > 0));
		});
	}

	function deleteSession(req, res, callback) {
		var sessionhash = req.cookies[options.cookiePrefix + 'sessionhash'];
		var userid = (req.vbuser ? req.vbuser.userid : 0);

		res.clearCookie(options.cookiePrefix + 'sessionhash');
		res.clearCookie(options.cookiePrefix + 'userid');
		res.clearCookie(options.cookiePrefix + 'password');
		res.clearCookie(options.cookiePrefix + 'imloggedin');

		var query = mysql.format('DELETE FROM ' +
			'session WHERE ' +
			'sessionhash = ? OR (userid = ? AND userid > 0)', [sessionhash, userid]
		);

		database.query(query, function(err, rows) {
			if (err) return callback(err, null);

			callback(null, 'success');
		});
	}

	// Returns the userid if the username/password are valid, or zero if it's not valid
	function isValidLogin(username, password, callback) {
		var query = mysql.format('SELECT userid, password FROM user WHERE ' +
			'username = ? AND ' +
			'(password = md5(concat(?, salt)) OR password = md5(concat(md5(?), salt)))', [username, password, password]
		);

		database.query(query, function(err, rows) {
			if (err) {return callback(err, null);}

			callback(null, rows[0]);
		});
	}

	// Get user info
	function getUserInfo(userid, callback) {
		// Avoid performing this query if the user is not authenticated
		if (userid === 0) {
			return callback(null, defaultUserObject);
		}

		var query = 'SELECT userid, username, usergroupid, ' +
			'membergroupids, email, posts FROM user WHERE userid = ' + mysql.escape(userid);

		database.query(query, function(err, rows) {
			if (err) return callback(err, null);

			callback(null, rows[0]);
		});
	}

	// Returns the currently active session, or null if there isn't any
	function getActiveSession(req, sessionHash, callback) {
		if (sessionHash && sessionHash.length > 0) {
			var query = mysql.format('SELECT * FROM session' +
				' WHERE sessionhash = ? AND idhash = ? AND lastactivity > ?', [sessionHash, fetchIdHash(req), moment().unix() - options.cookieTimeout]
			);

			database.query(query, function(err, rows) {
				if (err) {return callback(err, null);}

				callback(null, rows[0]);
			});
		} else {
			callback(null, null);
		}
	}

	// Returns true if the cookie userid/password is valid, false otherwise
	function checkRememberMeCredentials(userid, password, callback) {
		var query = mysql.format('SELECT userid FROM user' +
			' WHERE userid = ? AND md5(concat(password, ?)) = ?', [userid, options.cookieSalt, password]
		);

		database.query(query, function(err, rows) {
			if (err) {return callback(err, null);}

			callback(null, rows[0]);
		});
	}

	// Just for code reusing
	function updateOrCreateSession(req, res, sessionHash, userid, callback) {
		// Append user info to request object
		req.vbuser = {
			userid: userid
		};
		var url = options.defaultPath ? options.defaultPath : req.path;

		var callArray = [
			// we'll always want to retrieve the user info, no matter if we're gonna update, create a session, or do nothing
			function(cb) {
				getUserInfo(userid, function(err, userinfo) {
					if (err) return cb(err);

					return cb(null, userinfo);
				});
			}
		];

		if (options.refreshActivity) {
			// There will be scenarios where we'll not care about updating the database at all. i.e.:
			// socket connection, where all this info is done in a redis instance.
			if (sessionHash && sessionHash.length > 0) {
				// If the user already has a session, just update the session info
				callArray.push(
					function(cb) {
						updateUserActivity(url, userid, sessionHash, function(err, updated) {
							if (err) return cb(err);

							if (!updated) {
								// if for some reason his old session wasn't in the db, then just make him a new one
								// this should never happen, but just in case...
								createSession(req, res, userid, function(err, newhash) {
									if (err) return cb(err);

									cb(null, newhash);
								});
							} else {
								cb(null);	
							}
						});
					}
				);
			} else {
				// If he does not have a session yet, lets give him a new one!
				callArray.push(
					function(cb) {
						createSession(req, res, userid, function(err, newhash) {
							if (err) return cb(err);

							cb(null, newhash);
						});
					}
				);
			}
		}

		// After the tasks have been done, we may get back to where we were...
		async.parallel(callArray, function(err, results) {
			if (err) {return callback(err);}

			req.vbuser = results[0];
			callback();
		});
	}

	// Increases the amount of login tries in the database
	function execStrikeUser(username, userip, callback) {
		if (!options.useStrikeSystem) {
			return callback(null, null);
		}

		database.query("INSERT INTO strikes " +
		"(striketime, strikeip, username) " +
		"VALUES " +
		"(?, ?, ?)",
		[moment().unix(), userip, username],
		function(err, results) {
			if (err) return callback(err, null);

			return callback(null, null);
		});
	}

	// Removes his login strikes after a successful login
	function execUnstrikeUser(username, userip, callback) {
		if (!options.useStrikeSystem) {
			return callback(null, null);
		}

		database.query("DELETE FROM strikes WHERE strikeip = ? AND username = ?",
		[userip, username],
		function(err, results) {
			if (err) return callback(err, null);

			return callback(null, null);
		});
	}

	// Checks whether the user can try logging in or not
	// If he already typed the password wrongly 5 times
	// in the last 15 minutes he will not be allowed to try again
	function verifyStrikeStatus(username, userip, callback) {
		if (!options.useStrikeSystem) {
			return callback(null, 0);
		}

		database.query("DELETE FROM strikes WHERE striketime < ?", [moment().unix() - 3600], function(err, results) {
			if (err) return callback(err);

			database.query("SELECT COUNT(*) AS strikes, MAX(striketime) AS lasttime " +
			"FROM strikes " +
			"WHERE strikeip = ?",
			[userip],
			function(err, results) {
				if (err) return callback(err, null);

				if (results[0].strikes >= 5 && results[0].lasttime > moment().unix() - 900) {
					// they've got it wrong 5 times or greater for any username at the moment

					// the user is still not giving up so lets keep increasing this marker
					execStrikeUser(username, userip, function(err) {console.log(err);});
					return callback(null, results[0].strikes + 1);
				} else {
					return callback(null, results[0].strikes);
				}
			});			
		});
	}

	// Authenticates the session, and injects vbuser information 
	// in to the request object (req)
	function authenticateSession(req, res, next) {
		debug('Calling authenticateSession()');

		// userid and password are set when you login using remember-me
		var userid = parseInt(req.cookies[options.cookiePrefix + 'userid']) || 0;
		var password = req.cookies[options.cookiePrefix + 'password'];

		// sessionhash is set everywhere when navigating on vbulletin
		var sessionHash = req.cookies[options.cookiePrefix + 'sessionhash'];

		// Lets not repeat ourselves!
		var onGetUserInfo = function(err) {
			if (err) { return next(err); }

			next();
		};

		// Gets an active session, if it exists...
		getActiveSession(req, sessionHash, function(err, sessionObj) {
			if (err) { return next(err); }

			// Check if we have remember-me set
			if (userid && password && (!sessionObj || sessionObj.userid != userid)) {
				checkRememberMeCredentials(userid, password, function(err, isValid) {
					if (err) return next(err);

					if (isValid) {
						// Cool! Remember me password was correct!
						// Give him a new session!
						updateOrCreateSession(req, res, sessionHash, userid, onGetUserInfo);
					} else {
						// Remember me password was wrong. Lets clear it out!
						res.clearCookie(options.cookiePrefix + 'userid');
						res.clearCookie(options.cookiePrefix + 'password');
						userid = 0;

						// Now lets make a session for him, or update the current one
						updateOrCreateSession(req, res, sessionHash, userid, onGetUserInfo);
					}
				});
			} else {
				if (sessionObj) {
					userid = sessionObj.userid;
				}

				// Doesn't have a remember me...
				// Now lets make a session for him, or update the current one
				updateOrCreateSession(req, res, sessionHash, userid, onGetUserInfo);
			}
		});
	}

	// Middleware wrapper to make mustBe user, moderator, or admin...
	function mustBeMiddleware(req, res, next, func) {
		var tmp = function(userinfo, next, func) {
			if (func(userinfo)) {
				next();
			} else {
				var err = new Error('Invalid request');
				err.status = 400;
				next(err);
			}
		};

		// This will make sure the session won't get re-authenticated
		// if you had already attached a session() middleware.
		if (!req.vbuser) {
			authenticateSession(req, res, function() {
				tmp(req.vbuser, next, func);
			});
		} else {
			tmp(req.vbuser, next, func);
		}
	}

	/*******************************************************/
	/*********************** EXPORTS ***********************/
	/*******************************************************/

	module.session = authenticateSession;

	module.session = authenticateSession;

	module.mustBeUser = function(req, res, next) {
		mustBeMiddleware(req, res, next, module.isUser);
	};

	module.mustBeAdmin = function(req, res, next) {
		mustBeMiddleware(req, res, next, module.isAdmin);
	};

	module.mustBeModerator = function(req, res, next) {
		mustBeMiddleware(req, res, next, module.isModerator);
	};

	module.login = function(login, pass, rememberme, req, res, callback) {
		var ip = getIp(req);
		var sessionHash = req.cookies[options.cookiePrefix + 'sessionhash'];
		console.log(login, pass, rememberme);

		verifyStrikeStatus(login, ip, function(err, strikes) {
			if (err) return callback(err, null);

			if (strikes >= 5) {
				return callback(null, 'failed, too many tries');
			}

			isValidLogin(login, pass, function(err, userinfo) {
				if (err) return callback(err, null);

				if (!userinfo) {
					execStrikeUser(login, ip, function(err) {console.log(err);});
					return callback(null, 'failed, wrong login or password');
				}

				execUnstrikeUser(login, ip, function(err) {console.log(err);});
				if (rememberme) {
					var hash = userinfo.password + options.cookieSalt;
					hash = crypto.createHash('md5')
						.update(hash)
						.digest('hex');

					var cookieAge = (365*24*60*60*1000);
					res.cookie(options.cookiePrefix + 'userid', userinfo.userid, { maxAge: cookieAge, secure: options.secureCookies, httpOnly: true });
					res.cookie(options.cookiePrefix + 'password', hash, { maxAge: cookieAge, secure: options.secureCookies, httpOnly: true });
				}

				createSession(req, res, userinfo.userid, function(err, hashid) {
					if (err) return callback(err, null);

					// We just gave him a new session, lets delete his old one, if he had one...
					if (options.refreshActivity && sessionHash && sessionHash.length > 0) {
						database.query('DELETE FROM session WHERE sessionhash = ?', [sessionHash], function(err, result) {if (err) return console.log(err);});
					}

					getUserInfo(userinfo.userid, function(err, userinfo) {
						if (err) return callback(err, null);
						req.vbuser = userinfo;

						callback(null, 'success');
					});
				});
			});
		});
	};

	// Check usergroup
	module.isUser = function(userinfo) {
		return (
			userinfo.usergroupid > 1 &&
			userinfo.usergroupid != 8 && // banned
			userinfo.usergroupid != 3 && // awaiting email confirmation
			userinfo.usergroupid != 4    // awaiting moderation
		);
	};

	module.isAdmin = function(userinfo) {
		return (userinfo.usergroupid === 6);
	};

	module.isModerator = function(userinfo) {
		return (
			// admins, moderators and super moderators
			userinfo.usergroupid >= 6 && userinfo.usergroupid <= 8
		);
	};

	module.logout = deleteSession;

	return module;
};