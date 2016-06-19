'use strict';
const co = require('co');
const _ = require('lodash');
const throwjs = require('throw.js');
const db = require('../db');

exports.add = function(req, res, next) {
  let userId = req.body.user_id;
  let productId = req.body.product_id;

  let values = {
    user_id: userId, // eslint-disable-line
    product_id: productId, // eslint-disable-line
    rating: Number(req.body.rating),
    comment: req.body.comment
  };

  let validation = checkValues(values);
  if (validation.message) {
    return next(new throwjs.badRequest(validation.message));
  }

  let connection;
  co(function * () {
    connection = yield db.pool.getConnectionAsync();
    yield checkUserProduct([userId, productId], connection);
    yield connection.beginTransactionAsync();
    let data = yield addReview(values, connection);
    connection.commit();
    connection.release();
    res.json(data);
  }).catch(e => {
    connection.rollback();
    connection.release();
    next(e);
  });
};

/**
 * validation for values object
 * @param {object} values - values for db.q
 * @return {object} - validation result
 */
function checkValues(values) {
  if (!_.isInteger(values.user_id) || values.user_id < 1) {
    return {
      message: 'user_id is invalid'
    };
  }
  if (!_.isInteger(values.product_id) || values.product_id < 1) {
    return {
      message: 'product_id is invalid'
    };
  }
  if (!_.isInteger(values.rating) || !_.inRange(values.rating, 0, 10)) {
    return {
      message: 'rating is invalid'
    };
  }

  return {message: null};
}

/**
 * check user and product exists or not
 * @param {array} values - vaules for sql
 * @param {object} connection - mysql.connection
 * @return {Promise} user and product info
 */
function checkUserProduct(values, connection) {
  let options = {
    sql: db.sql.getByUserByProduct,
    values: values
  };

  return co(function * () {
    let data = yield connection.queryAsync(options);
    if (!data.length) {
      throw new throwjs.badRequest('user or product does not exist');
    }

    if (data[0].usertype !== 'customer') {
      throw new throwjs.badRequest('invalid user, only customer can post a review');
    }

    return data[0];
  });
}

/**
 * add review into database
 * @param {array} values - vaules for sql
 * @param {object} connection - mysql.connection
 * @return {Promise} execution result from database
 */
function addReview(values, connection) {
  let options = {
    sql: db.sql.addReview,
    values: values
  };

  return connection.queryAsync(options);
}
