var socket = require('socket.io-client')();
var ChatActions = require('./actions/ChatActions');
var ChatStore = require('./stores/ChatStore');

function _onSend(messageType, data) {
	socket.emit(messageType, data);
}

function onConnect() {
  ChatStore.addSocketListener(_onSend);
}

function onDisconnect() {
	ChatActions.disconnected();
	ChatStore.removeSocketListener(_onSend);
}

function onError(err) {
	if (typeof(err) !== 'string') {
		return;
	}

	console.log(err);
	var text = '';
	if (err.indexOf('Banned') === 0) {
		text = 'You were banned from this chat.';

		var reason = err.slice(8);
		if (reason.indexOf(':') > 0) {
			text += ' Reason given by ' + reason;
		}
	} else if (err.indexOf('Posts') === 0) {
		text = 'You are not allowed to use this chat.';
	} else {
		text = 'You must be logged in to use WindBot Chat. Follow [this link](https://forums.tibiawindbot.com/login.php?do=login) to authenticate.';
	}

	ChatActions.receiveMessage(text);
}

var onReceive = {
	welcomeMessage: function(data) {
		ChatActions.receiveInitialData(data);
	},
	message: function(data) {
		ChatActions.receiveMessage(data);
	},
	setCookies: function(data) {
		document.cookie = data;
	},
	banSuccess: function(data) {
		ChatActions.receiveBanSuccess(data);
	},
	unbanSuccess: function(data) {
		ChatActions.receiveUnbanSuccess(data);
	},
	pong: function(timems) {
		ChatActions.receivePong(timems);
	},
	status: function(info) {
		ChatActions.receiveStatusMessage(info);
	}
};

socket
.on('connect', onConnect)
.on('error', onError)
.on('disconnect', onDisconnect)
.on('welcome message', onReceive.welcomeMessage)
.on('set cookies', onReceive.setCookies)
.on('ban success', onReceive.banSuccess)
.on('unban success', onReceive.unbanSuccess)
.on('message', onReceive.message)
.on('status', onReceive.status)
.on('pong', onReceive.pong);

module.exports = socket;