'use strict';

const express = require('express');
const throwjs = require('throw.js');
const product = require('./product');
const review = require('./review');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/product')
  .get(product.getLatestProducts);

router.route('/product/:productId')
  .get(product.getById);

router.route('/review')
  .post(review.add);

// 404
router.route('*')
  .get((req, res, next) => {
    next(new throwjs.notFound());
  });

module.exports = router;
