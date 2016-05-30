'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let sql = {};

let sqlDir = path.join(__dirname, './sql');
let files = fs.readdirSync(sqlDir);

files.forEach(file => {
  let key = file.slice(0, -4); // remove .sql
  sql[_.camelCase(key)] = fs.readFileSync(path.join(sqlDir, file)).toString();
});

module.exports = sql;
