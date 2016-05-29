'use strict';

const _ = require('lodash');
const db = require('../db');

const REVIEW_TABLE = 'review';

exports.add = function(req, res) {
  let values = {
    user_id: req.body.user_id, // eslint-disable-line camelcase
    product_id: req.body.product_id, // eslint-disable-line camelcase
    rating: req.body.rating,
    comment: req.body.comment
  };

  let validation = checkValues(values);
  if (validation.error) {
    return res.status(400).send({message: validation.message});
  }

  let options = {
    sql: `INSERT INTO \`${REVIEW_TABLE}\` SET ?`,
    values: values
  };

  db.q(options)
    .then(data => {
      res.send(data);
    })
    .catch(e => {
      res.status(400).send({message: e});
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
      error: true,
      message: 'user_id is invalid'
    };
  }
  if (!_.isInteger(values.product_id) || values.product_id < 1) {
    return {
      error: true,
      message: 'product_id is invalid'
    };
  }
  if (!_.isInteger(values.rating) || !_.inRange(values.rating, 0, 10)) {
    return {
      error: true,
      message: 'product_id is invalid'
    };
  }

  return {error: null, message: null};
}
