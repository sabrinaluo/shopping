'use strict';

const chai = require('chai');
chai.use(require('sinon-chai')).should();
const sinon = require('sinon');
const supertest = require('supertest');
const db = require('./../../db');

describe('product', () => {
  let sandbox;
  let server;

  before(() => {
    sandbox = sinon.sandbox.create();
    server = supertest(require('./../../app'));
  });

  after(() => {
    sandbox.restore();
  });

  describe('/api/product', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should 200, with no brand id', done => {
      sandbox.stub(db.pool, 'getConnectionAsync').returns(
        Promise.resolve({
          queryAsync: () => Promise.resolve([]),
          release: () => {
          }
        })
      );
      server.get('/api/product')
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });
  });

  describe('/api/product/:productId', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should 404, if product not exists', done => {
      sandbox.stub(db.pool, 'getConnectionAsync').returns(
        Promise.resolve({
          queryAsync: () => Promise.resolve([]),
          release: () => {
          }
        }));
      server.get('/api/product/10')
        .end((err, res) => {
          res.status.should.equal(404);
          done();
        });
    });

    it('should 200, if product exists', done => {
      sandbox.stub(db.pool, 'getConnectionAsync').returns(
        Promise.resolve({
          queryAsync: () => Promise.resolve([{}]),
          release: () => {
          }
        }));
      server.get('/api/product/1')
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });
  });
});
