var mysql = require('mysql');
var config = require('../config');
var database = mysql.createPool(config.mysql);

module.exports = database;