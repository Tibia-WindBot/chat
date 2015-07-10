var keymirror = require('keymirror');

module.exports = keymirror({
  /* Serverside messages */
	INITIALMESSAGE_RECEIVED: null,
	SOCKET_DISCONNECTED: null,
	MESSAGE_RECEIVED: null,
  MUTE_USER: null,
  UNMUTE_USER: null,
  BAN_USER_SUCCESS: null,
  UNBAN_USER_SUCCESS: null,
  SERVER_STATUS_RECEIVED: null,
  PONG: null,

  /* Outgoing messages */
	SEND_MESSAGE: null,
  BAN_USER: null,
  KICK_USER: null,
  UNBAN_USER: null,
  SERVER_STATUS: null,
  PING: null,
  MOTD_UPDATE: null
});
