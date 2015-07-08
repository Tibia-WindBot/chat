var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var utils = require('../utils/ChatMessage');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var moment = require('moment');

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
    return (this.usergroupid >= 6 && this.usergroupid <= 8);
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
    insertMessage('<p>You just muted \'' + username + '\' temporarily, this mute will last until your next visit to this chat. Typing <strong>/unmute  \'' + username + '\'</strong> will undo this action</p>');
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
  insertMessage(utils.buildMessage(
    '<p>User \'' + data.username + '\' got banned by \'' + data.modname + '\'.</p>',
    'Server'
  ));
}

/**
 * Appends a message saying that the user got banned.
 * @param {object} username The name of the user that got banned
 */
function userUnbannedReceived(data) {
  unmuteUser(data.username, true);
  insertMessage(utils.buildMessage(
    '<p>User \'' + data.username + '\' got unbanned by \'' + data.modname + '\'.</p>',
    'Server'
  ));
}

 /**
  * Inserts a new message
  * @param {object} msg The message to be inserted
  * @return {boolean} emitchange Whether it should emit the change event or not. It won't emit it when the message sender is muted
  */
function insertMessage(msg) {
  if (typeof(msg) === 'string') {
    return insertMessage(utils.buildMessage(msg));
  }

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
      break;
    case ChatConstants.SERVER_STATUS:
      ChatStore.emitSocketMessage('status');
      break;
    default:
			// do nothing
  }
});

module.exports = ChatStore;