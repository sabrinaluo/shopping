'use strict';

const throwjs = require('throw.js');
const db = require('../db');

exports.getLatestProducts = function(req, res, next) {
  let brandId = req.query.brand_id;
  let sql = brandId ? db.sql.getLatestProductsByBrand : db.sql.getLatestProducts;
  let values = brandId ? [brandId] : [];
  let options = {
    sql: sql,
    values: values
  };

  db.q(options)
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      next(new throwjs.badRequest(e));
    });
};

exports.getById = function(req, res, next) {
  let productId = req.params.productId;
  let options = {
    sql: db.sql.getProductById,
    values: [productId]
  };

  db.q(options)
    .then(data => {
      if (data.length) {
        res.json(data[0]);
      } else {
        next(new throwjs.notFound());
      }
    })
    .catch(e => {
      next(new throwjs.badRequest(e));
    });
};
