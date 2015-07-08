var moment = require('moment');

module.exports = {
  buildMessage: function(msg, sendername, senderid, senderusergroup, time) {
    var ret = {
      message: msg,
      userid: senderid || 0,
      username: sendername || 'Chat Help',
      usergroupid: senderusergroup || 0,
      time: time || moment()
    };

    return ret;
  },

  /**
   * Splits the arguments in the format: '/command param1 "par am2"' into: ['/command', 'param1', 'par am2', ...]
   * Credits: https://github.com/elgs/splitargs/blob/master/splitargs.js
   * 
   * @param {string} input Text to be parsed in to an array
   * @return {array} strArray An array containing all the parameters split
   */
  splitArgs: function(input) {
    var separator = /\s/g;
    var singleQuoteOpen = false;
    var doubleQuoteOpen = false;
    var tokenBuffer = [];
    var ret = [];
    
    var arr = input.split('');
    for (var i = 0; i < arr.length; ++i) {
        var element = arr[i];
        var matches = element.match(separator);
        if (element === "'") {
            if (!doubleQuoteOpen) {
                singleQuoteOpen = !singleQuoteOpen;
                continue;
            }
        } else if (element === '"') {
            if (!singleQuoteOpen) {
                doubleQuoteOpen = !doubleQuoteOpen;
                continue;
            }
        }
        
        if (!singleQuoteOpen && !doubleQuoteOpen) {
            if (matches) {
                if (tokenBuffer && tokenBuffer.length > 0) {
                    ret.push(tokenBuffer.join(''));
                    tokenBuffer = [];
                }
            } else {
                tokenBuffer.push(element);
            }
        } else if (singleQuoteOpen) {
            tokenBuffer.push(element);
        } else if (doubleQuoteOpen) {
            tokenBuffer.push(element);
        }
    }
    if (tokenBuffer && tokenBuffer.length > 0) {
        ret.push(tokenBuffer.join(''));
    }

    return ret;
  }
};