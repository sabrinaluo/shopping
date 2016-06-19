'use strict';
const bluebird = require('bluebird');
const mysql = bluebird.promisifyAll(require('mysql'));
bluebird.promisifyAll(require("mysql/lib/Connection").prototype);
bluebird.promisifyAll(require("mysql/lib/Pool").prototype);
const dbConfig = require('../config').get('mysql');
const sql = require('./sql');

let pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
});

module.exports = {pool, sql};
