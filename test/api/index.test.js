/* eslint-env mocha */
/* eslint-disable camelcase*/
'use strict';

const chai = require('chai');
chai.use(require('sinon-chai')).should();
const sinon = require('sinon');

const supertest = require('supertest');
const db = require('./../../db');

describe('api', () => {
  let sandbox;
  let server;

  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(db.connection, 'connect').returns(function() {
    });
    sandbox.stub(db, 'q').returns(Promise.resolve());
    server = supertest(require('./../../app'));
  });

  after(() => {
    sandbox.restore();
  });

  describe('404', () => {
    it('should 404, if router is not defined', done => {
      server.get('/api/notexists')
        .end((err, res) => {
          res.status.should.equal(404);
          done();
        });
    });
  });
});
