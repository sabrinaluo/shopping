'use strict';

const logger = require('./logger');

module.exports = function(err, req, res, next) {
  if (err) {
    logger.error(err);
    res.status(err.statusCode || 500).json({message: err.message});
  } else {
    next();
  }
};
