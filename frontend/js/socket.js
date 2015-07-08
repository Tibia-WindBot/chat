var socket = require('socket.io-client')();
var ChatActions = require('./actions/ChatActions');
var ChatStore = require('./stores/ChatStore');
var utils = require('./utils/ChatMessage');
var marked = require('marked');

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

	var text = '';
	if (err.indexOf('Banned') === 0) {
		text = '<p>You were banned from this chat.';

		var reason = err.slice(8);
		if (reason.indexOf(':') > 0) {
			text += ' Reason given by ' + marked(reason);
		}
		text += '</p>';
	} else if (err.indexOf('Posts') === 0) {
		text = '<p>You are not allowed to use this chat.</p>';
	} else {
		text = '<p>You must be logged in to use WindBot Chat. Follow <a href="https://forums.tibiawindbot.com/login.php?do=login">this link</a> to authenticate.</p>';
	}

	ChatActions.receiveMessage(utils.buildMessage(text, 'Server'));
}

var onReceive = {
	welcomeMessage: function(data) {
		ChatActions.receiveInitialData(data);
		//MessageContainer.shouldScroll = true;
	},
	message: function(data) {
		ChatActions.receiveMessage(data);
	},
	setCookies: function(data) {
		console.log(data);
	},
	banSuccess: function(data) {
		ChatActions.receiveBanSuccess(data);
	},
	unbanSuccess: function(data) {
		ChatActions.receiveUnbanSuccess(data);
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
.on('message', onReceive.message);

module.exports = socket;