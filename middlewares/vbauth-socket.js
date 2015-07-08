var cookie = require('cookie'); // used by socket.io authentications

module.exports = function (database, options) {
  var module = {};

	// Import regular vbauth, made for Express
	var vbauth = require('./vbauth')(database, options);

	function authenticateSession(socket, next) {
		// This will simply change the socket requests to make it match Express syntax
		socket.request.cookies = cookie.parse(socket.request.headers.cookie || '');

		var ip = socket.handshake.headers['x-forwarded-for'];
		if (!ip) {
			ip = socket.handshake.address;
		} else {
			ip = ip.split(/,\s+/)[0];
		}
		socket.request.ip = ip; //socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
		socket.request.header = function(arg) {
			return socket.request.headers[arg];
		};

		var res = {
			cookie: function(name, val, options) {
				// from Express Framework
			  options = {} || options;
			  if ('number' == typeof val) val = val.toString();
			  if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
			  if ('maxAge' in options) {
			    options.expires = new Date(Date.now() + options.maxAge);
			    options.maxAge /= 1000;
			  }
			  if (null === options.path) options.path = '/';
			  var headerVal = cookie.serialize(name, String(val), options);

			  // supports multiple 'res.cookie' calls by getting previous value
			  var prev = this._cookies;
			  if (prev) {
			    if (Array.isArray(prev)) {
			      headerVal = prev.concat(headerVal);
			    } else {
			      headerVal = [prev, headerVal];
			    }
			  }
			  this._cookies = headerVal;
			},
			clearCookie: function(name) {
	  		var opts = { expires: new Date(1), path: '/' };
				this.cookie(name, '', opts);
			},
			_cookies: null
		};

		// Now that we've made the necessary changes, all we have to do is call
		// authenticateSession, as if the data came from a regular Express App
		vbauth.session(socket.request, res, function(err) {
			if (err) {
				// We don't wanna expose exactly what went wrong, so lets just
				// log it and throw a random error message to the user

				err = new Error('Whoops, something went wrong!');
				err.status = 500;
				return next(err);
			}

			socket.vbuser = socket.request.vbuser;
			delete socket.request.vbuser;

			socket.emit('set cookies', res._cookies);
			next();
		});
	}

	// Middleware wrapper to make mustBe user, moderator, or admin...
	function mustBeMiddleware(socket, next, func) {
		var tmp = function(userinfo, next, func) {
			if (userinfo && func(userinfo)) {
				next();
			} else {
				// means u're not authenticated, or you don't have enough permissions for proceeding
				next(new Error('Whoops, something went wrong!'));
			}
		};

		// This will make sure the session won't get re-authenticated
		// if you had already attached a session() middleware.
		if (!socket.vbuser) {
			authenticateSession(socket, function(err) {
				if (err) {
					return next(err);
				}

				tmp(socket.vbuser, next, func);
			});
		} else {
			tmp(socket.vbuser, next, func);
		}
	}
	
	/*******************************************************/
	/*********************** EXPORTS ***********************/
	/*******************************************************/

	module.session = authenticateSession;

	module.mustBeUser = function(socket, next) {
		mustBeMiddleware(socket, next, vbauth.isUser);
	};

	module.mustBeAdmin = function(socket, next) {
		mustBeMiddleware(socket, next, vbauth.isAdmin);
	};

	module.mustBeModerator = function(socket, next) {
		mustBeMiddleware(socket, next, vbauth.isModerator);
	};

	module.isAdmin = vbauth.isAdmin;
	module.isModerator = vbauth.isModerator;
	module.isUser = vbauth.isUser;

  return module;
};


