'use strict';
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');

nconf.argv().env();

// default env develop
let env = nconf.get('NODE_ENV') || 'develop';
let envFilePath = path.join(__dirname, `./${env}.json`);
nconf.file(envFilePath);

// default port 8080
let port = nconf.get('PORT') || 8080;
nconf.set('PORT', port);

if (env === 'production') {
  // create a write stream
  let accessLogPath = path.join(__dirname, '../logs/access.log');
  let accessLogStream = fs.createWriteStream(accessLogPath, {flags: 'a'});

  nconf.set('morgan:option', {stream: accessLogStream});
}

module.exports = nconf;
