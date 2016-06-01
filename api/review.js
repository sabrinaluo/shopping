'use strict';

const _ = require('lodash');
const throwjs = require('throw.js');
const db = require('../db');

exports.add = function(req, res, next) {
  let userId = req.body.user_id;
  let productId = req.body.product_id;

  let values = {
    user_id: userId,
    product_id: productId,
    rating: Number(req.body.rating),
    comment: req.body.comment
  };

  let validation = checkValues(values);
  if (validation.message) {
    return next(new throwjs.badRequest(validation.message));
  }

  checkUserProduct([userId, productId])
    .then(() => {
      return addReview(values);
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
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

function checkUserProduct(values) {
  let options = {
    sql: db.sql.getByUserByProduct,
    values: values
  };

  return db.q(options)
    .then(data => {
      if (!data.length) {
        throw new throwjs.badRequest('user or product does not exist');
      }

      if (data[0].usertype !== 'customer') {
        throw new throwjs.badRequest('invalid user, only customer can post a review');
      }

      return Promise.resolve(data[0]);
    });
}

function addReview(values) {
  let options = {
    sql: db.sql.addReview,
    values: values
  };

  return db.q(options);
}
