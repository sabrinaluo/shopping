'use strict';
const co = require('co');
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

  let connection;
  co(function * () {
    connection = yield db.pool.getConnectionAsync();
    console.log(connection);
    let data = yield connection.queryAsync(options);
    connection.release();
    res.json(data);
  }).catch(e => {
    connection.release();
    next(new throwjs.badRequest(e));
  });
};

exports.getById = function(req, res, next) {
  let productId = req.params.productId;
  let options = {
    sql: db.sql.getProductById,
    values: [productId]
  };

  let connection;
  co(function * () {
    connection = yield db.pool.getConnectionAsync();
    let data = yield connection.queryAsync(options);
    connection.release();
    if (data.length) {
      res.json(data);
    } else {
      next(new throwjs.notFound());
    }
  }).catch(e => {
    connection.release();
    next(new throwjs.badRequest(e));
  });
};
