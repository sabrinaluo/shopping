'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
const apiRouter = require('./api');
const errorHandler = require('./error_handler');

const PORT = config.get('PORT');

const STATIC_DIR = path.join(__dirname, 'public');
let app = express();
app.use('/', express.static(STATIC_DIR));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'shoppinglkjJHK879',
  saveUninitialized: true,
  resave: false
}));

let allowCORS = config.get('cors');
if (allowCORS) {
  app.use(cors());
}

let morganConfig = config.get('morgan');
app.use(morgan(morganConfig.format, morganConfig.option));

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info('app is listening on port: ', PORT);
});

module.exports = app;
