'use strict';
const bunyan = require('bunyan');
const config = require('./config').get('bunyan');

module.exports = bunyan.createLogger(config);
