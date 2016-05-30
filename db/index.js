'use strict';

const mysql = require('mysql');
const logger = require('../logger');
const dbConfig = require('../config').get('mysql');
const sql = require('./sql');

let connection = mysql.createConnection({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
});

/**
 * Promisify query method
 * see https://github.com/felixge/node-mysql The third form .query(options, callback)
 * @param {object} options - options for query database
 * @param {string} options.sql - sql for execution
 * @param {array|object} [options.values] - values
 * @return {Promise} - query result, reject with {object}, resolve with {object[]}
 */
function q(options) {
  return new Promise((resolve, reject) => {
    connection.query(options, (err, rows) => {
      logger.debug('db query: ', options);
      if (err) {
        logger.error('db err: ', err);
        reject(err);
      } else {
        logger.debug('db response: ', rows);
        resolve(rows);
      }
    });
  });
}

module.exports = {q, connection, sql};
