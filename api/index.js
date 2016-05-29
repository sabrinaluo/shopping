'use strict';

const express = require('express');
const product = require('./product');
const review = require('./review');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/product')
  .get(product.getAll);

router.route('/product/:productId')
  .get(product.getById);

router.route('/review')
  .post(review.add);

module.exports = router;
