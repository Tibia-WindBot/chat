var fs = require('fs');

var nodeenv = process.env.NODE_ENV || 'development';
var dbInfo = require('./mysql.' + nodeenv + '.json');
var vbauth = require('./vbauth.' + nodeenv + '.json');

module.exports = {
  mysql: dbInfo,
  vbauth: vbauth
};
