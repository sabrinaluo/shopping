'use strict';

const db = require('../db');

const PRODUCT_TABLE = 'product';

exports.getAll = function(req, res) {
  let options = {
    sql: `SELECT * FROM \`${PRODUCT_TABLE}\` ORDER BY \`date_created\` DESC LIMIT 10`
  };

  db.q(options)
    .then(data => {
      res.send(data);
    })
    .catch(e => {
      res.status(400).send({message: e});
    });
};

exports.getById = function(req, res) {
  let id = req.params.productId;
  let options = {
    sql: `SELECT * FROM \`${PRODUCT_TABLE}\` WHERE ?`,
    values: {id: id}
  };

  db.q(options)
    .then(data => {
      if (data.length) {
        res.send(data[0]);
      } else {
        res.status(404).send({message: 'Not Found'});
      }
    })
    .catch(e => {
      res.status(400).send({message: e});
    });
};
