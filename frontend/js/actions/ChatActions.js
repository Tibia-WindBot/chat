var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var utils = require('../utils/ChatMessage');
var ChatStore = require('../stores/ChatStore');

var ChatActions = {

  /**
   * @param {array} command An array of strings containing the parameters
   */
  sendCommand: function(cmd) {
    switch (cmd[0]) {
      case '/ban':
        this.banUser(cmd[1], cmd[2], parseInt(cmd[3]) || null);
        break;
      case '/unban':
        this.unbanUser(cmd[1]);
        break;
      case '/mute':
        this.muteUser(cmd[1]);
        break;
      case '/unmute':
        this.unmuteUser(cmd[1]);
        break;
      case '/status':
        this.getServerStatus();
        break;
      case '/ping':
        this.ping();
        break;
      case '/kick':
        this.kickUser(cmd[1]);
        break;
      case '/motd':
        this.sendMotd(cmd[1]);
        break;
      default: {  
        // Insert a message with all the available commands
        var self = ChatStore.getUserInfo();

        var message = '<div class="well well-sm">Available commands:<br/>/help <small><em>- displays a list with all available commands</em></small><br/>/mute \'user name\' <small><em>- mutes the user \'user name\' temporarily, meaning you will no longer see his messages. The mute will last until you reopen WindBot Chat</em></small><br/>/unmute \'user name\' <small><em>- removes the mute from user \'user name\'</em></small>';
        if (self.isMod()) {
          message += '<br/>/ban \'user name\' \'reason\' 600 <small><em>- bans the user \'user name\' from the chat for 600 seconds. Default reason is none, and default time is 86400 seconds (24h)</em></small><br/>/unban \'user name\' <small><em>- removes the ban from user \'user name\'</em></small><br/>/kick \'user name\' <small><em>- kicks the user \'user name\' from the server</em></small><br/>/ping <small><em>- returns the latency in milliseconds</em></small>';
        }
        message += '</div>';

        AppDispatcher
        .dispatch({
          actionType: ChatConstants.MESSAGE_RECEIVED,
          message: message
        });
      }
    }
  },

  /**
   * @param {string} text The message content to be sent
   */
  sendMessage: function(text) {
    if (text[0] === '/') {
      return this.sendCommand(utils.splitArgs(text));
    }

    AppDispatcher
    .dispatch({
      actionType: ChatConstants.SEND_MESSAGE,
      text: text
    });
  },

  /**
   * @param {string} text The new motd message
   */
  sendMotd: function(text) {
    AppDispatcher
    .dispatch({
      actionType: ChatConstants.MOTD_UPDATE,
      text: text
    });
  },

  /**
   * @param {string} username The user to get banned
   * @param {string} reason Reason why you want to ban him
   * @param {string} duration How long should he be banned? 0 means indefinitely
   */
  banUser: function(username, reason, duration) {
    var self = ChatStore.getUserInfo();
    if (!self.isMod() || !username || username.length === 0) {
      return;
    }

    AppDispatcher
    .dispatch({
      actionType: ChatConstants.BAN_USER,
      username: username,
      reason: reason,
      duration: duration
    });
  },

  /**
   * @param {string} username The user to get kicked
   * @param {reason} reason Reason why he got kicked
   */
  kickUser: function(username, reason) {
    var self = ChatStore.getUserInfo();
    if (!self.isMod() || !username || username.length === 0) {
      return;
    }

    AppDispatcher
    .dispatch({
      actionType: ChatConstants.KICK_USER,
      username: username,
      reason: reason
    });
  },

  /**
   * Send a ping message
   */
  ping: function() {
    AppDispatcher
    .dispatch({
      actionType: ChatConstants.PING,
      timems: (new Date()).valueOf()
    });
  },

  /**
   * @param {string} username The user to get unbanned
   */
  unbanUser: function(username) {
    var self = ChatStore.getUserInfo();
    if (!self.isMod() || !username || username.length === 0) {
      return;
    }

    AppDispatcher
    .dispatch({
      actionType: ChatConstants.UNBAN_USER,
      username: username
    });
  },

  /**
   * @param {string} username The user to be muted
   */
  muteUser: function(username, nowarning) {
    if (!username || username.length === 0) {
      return;
    }

    nowarning = nowarning || false;

    AppDispatcher.dispatch({
      actionType: ChatConstants.MUTE_USER,
      username: username,
      nowarning: nowarning
    });
  },

  /**
   * @param {string} username The user to be unmuted
   */
  unmuteUser: function(username) {
    if (!username || username.length === 0) {
      return;
    }

    AppDispatcher.dispatch({
      actionType: ChatConstants.UNMUTE_USER,
      username: username
    });
  },

  getServerStatus: function() {
    AppDispatcher.dispatch({
      actionType: ChatConstants.SERVER_STATUS
    });
  },

  /**
   * @param {object} data The message data, which contains the properties: username, usergroupid, userid, time and message
   */
  receiveMessage: function(data) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_RECEIVED,
      message: data
    });
  },

  /**
   * @param {object} data The initial data received right after logging in, containing the info about the users that just logged in, and the latest messages sent to the chat
   */
  receiveInitialData: function(data) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.INITIALMESSAGE_RECEIVED,
      messages: data.messages,
      self: data.self
    });
  },

  /**
   * @param {string} data The username of the banned user
   */
  receiveBanSuccess: function(data) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.BAN_USER_SUCCESS,
      data: data
    });
  },

  /**
   * @param {string} data The username of the banned user
   */
  receiveUnbanSuccess: function(data) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.UNBAN_USER_SUCCESS,
      data: data
    });
  },

  /**
   * @param {object} info The status info
   */
  receiveStatusMessage: function(info) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.SERVER_STATUS_RECEIVED,
      data: info
    });
  },

  /**
   * @param {number} timems The time when the first message was sent
   */
  receivePong: function(timems) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.PONG,
      timems: timems
    });
  },

  /**
   * Received when you get disconnected, which tells the user to clear all the chat data
   */
  disconnected: function() {
    AppDispatcher.dispatch({
      actionType: ChatConstants.SOCKET_DISCONNECTED
    });
  }
};

module.exports = ChatActions;