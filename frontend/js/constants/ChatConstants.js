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

  /* Outgoing messages */
	SEND_MESSAGE: null,
  BAN_USER: null,
  UNBAN_USER: null,
  SERVER_STATUS: null
});
