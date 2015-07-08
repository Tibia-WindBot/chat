var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants').EventEmitter;
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

_messagesQueue = [];

/*
 * Adds a message to the queue
 * @param {object} msg The message to be queued
 * @return {boolean} added Whether the message was queued or not
 */
function enqueueMessage(msg) {
  if (typeof(msg) === 'object') {
    _messagesQueue.push(msg);
  }
}

/*
 * Dequeues a certain amount of messages
 * @param {number} n How many messages should be dequeued
 */
function dequeueMessages(n) {
  _messagesQueue.splice(0, n);
}

var SocketStore = assign({}, EventEmitter.prototype, {

	/**
	 * Gets a list with all queued messages
	 * @return {array}
	 */
  getMessages: function() {
    return _messagesQueue;
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
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ChatConstants.MESSAGE_SEND:

      break;
    default:
			// do nothing
  }
});

module.exports = SocketStore;