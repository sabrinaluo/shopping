'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');
const db = require('./db');
const apiRouter = require('./api');

const PORT = config.get('PORT');

try {
  db.connection.connect();
} catch (e) {
  logger.error('database connect error: ', e);
  process.exit(1);
}

let app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'asdf',
  resave: false
}));

let morganConfig = config.get('morgan');
app.use(morgan(morganConfig.format, morganConfig.option));

app.use('/api', apiRouter);

app.listen(PORT, () => {
  logger.info('app is listening on port: ', PORT);
});

module.exports = app;
