var io = require('socket.io')();
var moment = require('moment');
var config = require('./config');
var redis = require('./databases/chat-redis');
var mysql = require('./databases/vb-mysql');
var vbauth = require('./middlewares/vbauth-socket')(mysql, config.vbauth);

var maxMessagesToShow = 64;
var messagesCount = 0;
var clientsCount = 0;

io.use(vbauth.mustBeUser);
io.use(verifyUserBan);
io.use(verifyPostCount);

function verifyUserBan(socket, next) {
	redis.get('user:' + socket.vbuser.userid + ':ban', function(err, reason) {
		if (err) {return console.log(err);}

		if (reason === null) {
			return next();
		}

		err = new Error('Banned: ' + reason);
		next(err);
	});
}

function verifyPostCount(socket, next) {
	var minPostCount = 300;

	if (!vbauth.isModerator(socket.vbuser) && socket.vbuser.posts < minPostCount) {
		err = new Error('Posts. You are not allowed to use this chat.');
		return next(err);
	}

	return next();
}

function onUserConnect(socket) {
	// increase connected count
	clientsCount++;

	// get latest messages from redis store
	redis.hmset('user:' + socket.vbuser.userid + ':socketids', socket.id, moment().unix());
	//.hmset('socket:' + socket.id + ':userinfo', socket.vbuser);

	fetchChatHistory(function(err, messages) {
		if (err) {return console.log(err);}

		var initialData = {
			self: {
				username: socket.vbuser.username,
				userid: socket.vbuser.userid,
				usergroupid: socket.vbuser.usergroupid,
				email: socket.vbuser.email,
			},
			messages: messages			
		};

		socket.emit('welcome message', initialData);
	});
}

function onMessageReceived(socket, text) {
	// validate message and slice it
	if (typeof(text) === 'string') {
		// message counter
		messagesCount++;

		text = text.slice(0, 255);
		var msg = {
			username: socket.vbuser.username,
			userid: socket.vbuser.userid,
			usergroupid: socket.vbuser.usergroupid,
			time: moment().format(),
			message: text
		};

		var multi = redis.multi();
		multi.rpush('chat-msgs:main', JSON.stringify(msg));
		multi.ltrim('chat-msgs:main', -maxMessagesToShow, -1);
		multi.exec();

		socket.broadcast.emit('message', msg);
	}
}

function fetchChatHistory(callback) {
	redis.lrange('chat-msgs:main', 0, maxMessagesToShow, function(err, rows) {
		if (err) {return callback(err, null);}

		var ret = [];
		rows.forEach(function(jsontext) {
			ret.push(JSON.parse(jsontext));
		});

		callback(err, ret);
	});
}

function deleteUserMessagesFromHistory(username, callback) {
	username = username.toLowerCase();

	fetchChatHistory(function(err, messages) {
		var newHistory = [];

		var multi = redis.multi();

		var len = 0;
		messages.forEach(function(msg) {
			if (msg.username.toLowerCase() != username) {
				multi.rpush('chat-msgs:main', JSON.stringify(msg));
				len++;
			}
		});

		multi.ltrim('chat-msgs:main', -len, -1);
		multi.exec();
	});
}

function onUserDisconnect(socket) {
	// decrease client counter
	clientsCount--;

	redis.hdel('user:' + socket.vbuser.userid + ':socketids', socket.id);
	//redis.del('socket:' + socket.id + ':userinfo', socket.vbuser);
}

function onBanUser(socket, info) {
	// only mods can ban!
	if (!(socket.vbuser.usergroupid >= 6 && socket.vbuser.usergroupid <= 8)) {
		return;
	}

	if (!info.username || typeof(info.username) !== 'string' || info.username.length < 3 || info.username.length > 25) {
		return;
	}

	if (typeof(info.time) !== 'number') {
		info.time = 86400;
	}

	if (!info.reason || typeof(info.reason) !== 'string') {
		info.reason = '';
	}
	info.reason = info.reason.slice(0, 140);
	if (info.reason.length > 0) {
		info.reason = ': ' + info.reason;
	}

	mysql.query('SELECT userid, usergroupid FROM user WHERE lower(username) = ?', [info.username.toLowerCase()], function(err, result) {
		if (err) {return console.log(err);}

		if (!result.length || 
			(socket.vbuser.usergroupid !== 6 && result[0].usergroupid >= 6 && result[0].usergroupid <= 8)) {
			// only admins can ban mods! :p
			return;
		}

		var key = 'user:' + result[0].userid + ':ban';
		redis.set(key, socket.vbuser.username + info.reason , function(err, rows) {
			if (err) {return console.log(err);}

			// expire key, if expiration date is specified
			if (info.time > 0) {
				redis.expire(key, info.time);
			}

			// kicks all connected instances of user
			kickUserById(result[0].userid);

			// deletes his messages from history
			deleteUserMessagesFromHistory(info.username);

			// tells the other users this user has been banned, and they should hide his messages
			io.sockets.emit('ban success', {username: info.username, modname: socket.vbuser.username, reason: info.reason});
		});
	});
}

function onKickUser(socket, info) {
	if (!(socket.vbuser.usergroupid >= 6 && socket.vbuser.usergroupid <= 8)) {
		// only mods can kick
		return;
	}

	if (!info.username || typeof(info.username) !== 'string' || info.username.length < 3 || info.username.length > 25) {
		return;
	}

	mysql.query('SELECT userid, usergroupid FROM user WHERE lower(username) = ?', [info.username.toLowerCase()], function(err, result) {
		if (err) {return console.log(err);}

		if (!result.length || 
			(socket.vbuser.usergroupid !== 6 && result[0].usergroupid >= 6 && result[0].usergroupid <= 8)) {
			// only admins can kick mods
			return;
		}

		// kicks all connected instances of user
		kickUserById(result[0].userid);
	});
}

// Kicks all connected instances of user
function kickUserById(userid) {
	redis.hgetall('user:' + userid + ':socketids', function(err, result) {
		if (err) {return console.log(err);}

		for (var socketid in result) {
	    if (result.hasOwnProperty(socketid)) {
	    	var socketToKick = io.sockets.connected[socketid];
	    	if (socketToKick) {
	    		socketToKick.disconnect();
	    	}
	    }
		}
	});
}

function onUnbanUser(socket, info) {
	// only mods can unban!
	if (!(socket.vbuser.usergroupid >= 6 && socket.vbuser.usergroupid <= 8)) {
		return;
	}

	if (!info.username || typeof(info.username) !== 'string' || info.username.length < 3 || info.username.length > 25) {
		return;
	}

	mysql.query('SELECT userid FROM user WHERE lower(username) = ?', [info.username.toLowerCase()], function(err, result) {
		if (err) {return console.log(err);}

		if (!result.length) {
			return;
		}
		
		var key = 'user:' + result[0].userid + ':ban';
		redis.del(key, function(err, rows) {
			if (err) {return console.log(err);}

			// tells the other users this user has been unbanned, and they can show his messages again
			io.sockets.emit('unban success', {username: info.username, modname: socket.vbuser.username, reason: info.reason});
		});
	});
}

function onRequestStatus(socket) {
	var os = require('os');

	if (socket.vbuser.usergroupid === 6) {
		var info = {
			cpuLoad: os.loadavg(),
			mem: [os.freemem(), os.totalmem()],
			messagesCount: messagesCount,
			serverUptime: os.uptime(),
			processUptime: process.uptime(),
			clients: []
		};

		var clients = io.sockets.connected;
		for (var key in clients) {
			if (clients.hasOwnProperty(key)) {
				info.clients.push(clients[key].vbuser);
			}
		}

		socket.emit('status', info);
	}
}

function onPingReceived(socket, timems) {
	console.log('Ping: ' + timems);
	if (socket.vbuser.usergroupid >= 6 && socket.vbuser.usergroupid <= 8) {
		socket.emit('pong', timems);
	}
}

io.on('connection', function(socket) {
	onUserConnect(socket);

	socket
	.on('message', function(text) {
		onMessageReceived(socket, text);
	})
	.on('ban', function(info) {
		onBanUser(socket, info);
	})
	.on('kick', function(info) {
		onKickUser(socket, info);
	})
	.on('unban', function(info) {
		onUnbanUser(socket, info);	
	})
	.on('status', function() {
		onRequestStatus(socket);
	})
	.on('disconnect', function() {
		onUserDisconnect(socket);
	})
	.on('ping', function(timems) {
		onPingReceived(socket, timems);
	});
});

module.exports = io;