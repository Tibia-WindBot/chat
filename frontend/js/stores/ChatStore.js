var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var utils = require('../utils/ChatMessage');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var moment = require('moment');
var numeral = require('numeral');

var CHANGE_EVENT = 'change';
var SOCKET_EVENT = 'socket';

_messages = [];
_mutedUsers = {};
_selfInfo = {
  username: 'unregistered',
  userid: 0,
  usergroupid: 1,
  email: '',
  isMod: function() {
    return (this.usergroupid >= 5 && this.usergroupid <= 7);
  },
  isAdmin: function() {
    return (this.usergroupid === 6);
  }
};

/**
 * Updates the user info
 * @param {object} info An object literal containing only the data that will get updated
 */
function updateSelf(info) {
  _selfInfo = assign({}, _selfInfo, info);
}

/**
 * Mutes a user, meaning all of his messages will not be rendered by our chat-view
 * @param {string} username The name of the user we want to mute
 * @return {boolean} emitchange Whether it should emit the change event or not. It won't emit it when there's no message from username on the messages list
 */
function muteUser(username, nowarning) {
  username = username.toLowerCase();

  var messagesMuted = 0;
  if (!_mutedUsers.hasOwnProperty(username)) {
    _mutedUsers[username] = null;
    _messages.forEach(function(msg) {
      if (msg.username.toLowerCase() === username) {
        msg.dontshow = true;
        messagesMuted++;
      }
    });
  }

  if (!nowarning) {
    insertMessage(
      '<p>You just muted \'' + username + '\' temporarily, this mute will last until your next visit to this chat. Typing <strong>/unmute  \'' + username + '\'</strong> will undo this action</p>',
      'Chat Help',
      true
    );
  }

  return ((messagesMuted > 0) || (!nowarning));
}

/**
 * Unmutes a user, making all his hidden messages appear again
 * @param {string} username The name of the user we want to unmute
 * @return {boolean} emitchange Whether it should emit the change event or not. It won't emit it when there's no message from username on the messages list
 */
function unmuteUser(username) {  
 	username = username.toLowerCase();

 	var messagesUnmuted = 0;
 	if (_mutedUsers.hasOwnProperty(username)) {
 		delete _mutedUsers[username];

 		_messages.forEach(function(msg) {
      if (msg.username.toLowerCase() === username && msg.dontshow) {
        delete msg.dontshow;
        messagesUnmuted++;
      }
    });
 	}

 	return (messagesUnmuted > 0);
}

/**
 * Appends a message saying that the user got banned.
 * @param {object} username The name of the user that got banned
 */
function userBannedReceived(data) {
  muteUser(data.username, true);
  insertMessage(
    '<p>User \'' + data.username + '\' got banned by \'' + data.modname + '\'.</p>',
    'Server',
    true
  );
}

/**
 * Appends a message saying that the user got banned.
 * @param {object} username The name of the user that got banned
 */
function userUnbannedReceived(data) {
  unmuteUser(data.username, true);
  insertMessage(
    '<p>User \'' + data.username + '\' got unbanned by \'' + data.modname + '\'.</p>',
    'Server',
    true
  );
}

 /**
  * Inserts a new message
  * @param {object/string} msg The message to be inserted
  * @return {boolean} emitchange Whether it should emit the change event or not. It won't emit it when the message sender is muted
  */
function insertMessage(msg, sendername, isRaw, senderid, senderusergroup, time) {
  msg = utils.buildMessage(msg, sendername, isRaw, senderid, senderusergroup, time);

  if (_mutedUsers.hasOwnProperty(msg.username.toLowerCase())) {
		// Just tag it as 'dontshow', but still add it to the list,
		// we never know if the user would unmute this sender some time
		msg.dontshow = true;
	}

	msg.time = moment(msg.time);
	_messages.push(msg);

	return (msg.dontshow !== true);
}

/**
 * Inserts a message showing the ping time.
 * @param {number} timems The time when the ping message was sent
 */
function pongMessageReceived(timems) {
  insertMessage(
    '<div class="well well-sm">Ping: ' + ((new Date()).valueOf() - timems) + 'ms</div>',
    'Server',
    true
  );
}

/**
 * Formats a status message and inserts it into the chat console.
 * @param {object} info An object containing the info sent by the server
 */
function statusMessageReceived(info) {
  var buildClientsInfo = function(clients) {
    var clientsCount = 0;
    var ret = '';

    clients.forEach(function(client) {
      if (clientsCount) { // Do not prepend a comma for the first connected client
        ret += ', ';
      }

      ret += '<a class="' + utils.getUserLinkClass(client.usergroupid) + '" href="https://forums.tibiawindbot.com/member.php?' + client.userid + '-' + client.username + '" target="_blank">' + client.username + '</a>';
      clientsCount++;
    });

    return ret;
  };

  var msg = '<div class="well well-sm"><strong>Server Status</strong>';

  // Doing it this way so we can choose what to send from the server.
  for (var key in info) {
    if (info.hasOwnProperty(key)) {
      switch(key) {
        case 'cpuLoad':
          msg += '<br/><em>CPU Load:</em> ' + numeral(info.cpuLoad[0]).format('0.0[0]') + '% (last minute), ' + numeral(info.cpuLoad[1]).format('0.0[0]') + '% (last 5 minutes), ' + numeral(info.cpuLoad[1]).format('0.0[0]') + '% (last 15 minutes)';
          break;
        case 'mem':
          msg += '<br/><em>Memory:</em> ' + numeral(info.mem[0]/1e9).format('0.0[0]') + 'GB/' + numeral(info.mem[1]/1e9).format('0.0[0]') + 'GB';
          break;
        case 'messagesCount':
          msg += '<br/><em>Messages Transmitted: </em> ' + numeral(info.messagesCount).format('0,0');
          break;
        case 'serverUptime':
          msg += '<br/><em>Server Uptime:</em> ' + utils.secondsToHHMMSS(info.serverUptime);
          break;
        case 'processUptime':
          msg += '<br/><em>Process Uptime:</em> ' + utils.secondsToHHMMSS(info.processUptime);
          break;
        case 'clients':
          msg += '<br/><em>Clients [' + numeral(info.clients.length).format('0,0') + ']:</em> ' + buildClientsInfo(info.clients);
          break;
      }
    }
  }
  msg += '</div>';

  insertMessage(msg,
    'Server',
    true
  );
}

/**
 * Clears everything, happens when the chat disconnects
 */
function clear() {
   _messages = [];
   _mutedUsers = {};
   updateSelf({
    username: 'unregistered',
    userid: 0,
    usergroupid: 1,
    email: ''
   });
}


var ChatStore = assign({}, EventEmitter.prototype, {

	/**
	 * Gets a list with all messages
	 * @return {array}
	 */
  getMessages: function() {
    return _messages;
  },

  /**
   * Gets the currently logged in user's info
   * @return {object} userinfo An object containing the logged user's info
   */
  getUserInfo: function() {
    return _selfInfo;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

	/**
	 * @param {function} callback
	 */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

	/**
	 * @param {function} callback
	 */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitSocketMessage: function(messageType, data) {
    this.emit(SOCKET_EVENT, messageType, data);
  },

  /**
   * @param {function} callback
   */
  addSocketListener: function(callback) {
    this.on(SOCKET_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeSocketListener: function(callback) {
    this.removeListener(SOCKET_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ChatConstants.INITIALMESSAGE_RECEIVED:
        updateSelf(action.self);
        action.messages.forEach(function(msg) {
          insertMessage(msg);
        });

        ChatStore.emitChange();
      break;
    case ChatConstants.SOCKET_DISCONNECTED:
      clear();
      ChatStore.emitChange();
      break;
    case ChatConstants.MESSAGE_RECEIVED:
      if (insertMessage(action.message)) {
        document.getElementById('message_audio').play();
        ChatStore.emitChange();
      }
      break;
    case ChatConstants.MUTE_USER:
      if (muteUser(action.username, action.nowarning)) {
        ChatStore.emitChange();
      }
      break;
    case ChatConstants.UNMUTE_USER:
      if (unmuteUser(action.username)) {
        ChatStore.emitChange();
      }
      break;
    case ChatConstants.BAN_USER_SUCCESS:
      userBannedReceived(action.data);
      ChatStore.emitChange();
      break;
    case ChatConstants.UNBAN_USER_SUCCESS:
      userUnbannedReceived(action.data);
      ChatStore.emitChange();
      break;
    case ChatConstants.SERVER_STATUS_RECEIVED:
      statusMessageReceived(action.data);
      ChatStore.emitChange();
      break;
    case ChatConstants.PONG:
      pongMessageReceived(action.timems);
      ChatStore.emitChange();
      break;

    // Outgoing messages
    case ChatConstants.BAN_USER:
      ChatStore.emitSocketMessage('ban', {
        username: action.username,
        reason: action.reason || '',
        duration: action.duration || 86400
      });
      break;
    case ChatConstants.UNBAN_USER: 
      ChatStore.emitSocketMessage('unban', {
        username: action.username
      });
      break;
    case ChatConstants.SEND_MESSAGE:
      ChatStore.emitSocketMessage('message', action.text);

      // Insert the message to the UI immediately, so it will feel like the message was sent instantaneously
      if (insertMessage(action.text, _selfInfo.username, false, _selfInfo.userid, _selfInfo.usergroupid, moment())) {
        ChatStore.emitChange();
      }
      break;
    case ChatConstants.MOTD_UPDATE:
      ChatStore.emitSocketMessage('motd', action.text);
      break;
    case ChatConstants.SERVER_STATUS:
      ChatStore.emitSocketMessage('status');
      break;
    case ChatConstants.KICK_USER:
      ChatStore.emitSocketMessage('kick', {
        username: action.username,
        reason: action.reason
      });
      break;
    case ChatConstants.PING:
      ChatStore.emitSocketMessage('ping', action.timems);
      break;
    default:
			// do nothing
  }
});

module.exports = ChatStore;