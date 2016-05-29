/* eslint-env mocha */
/* eslint-disable camelcase*/
'use strict';

const chai = require('chai');
chai.use(require('sinon-chai')).should();
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');
const app = require('./../../app');
const db = require('./../../db');
const checkValues = rewire('./../../api/review').__get__('checkValues');

let server = supertest(app);
let url = '/api/review';

describe('review module', () => {
  describe('private: checkValues', () => {
    it('should return error null, if data is valid', () => {
      checkValues({
        user_id: 1,
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).should.have.property('error', null);
    });

    it('should return error true, if user_id is not a positive integer', () => {
      checkValues({
        user_id: undefined,
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).should.have.property('error', true);

      checkValues({
        user_id: 'abc',
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).should.have.property('error', true);

      checkValues({
        user_id: 1.5,
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).should.have.property('error', true);
    });

    it('should return error true, if product_id is not a positive integer', () => {
      checkValues({
        user_id: 1,
        product_id: 'abc',
        rating: 1,
        comment: 'test comment'
      }).should.have.property('error', true);

      checkValues({
        user_id: 1,
        product_id: -1,
        rating: 1,
        comment: 'test comment'
      }).should.have.property('error', true);
    });

    it('should return error true, if rating is not an integer within 0-9', () => {
      checkValues({
        user_id: 1,
        product_id: 1,
        rating: undefined,
        comment: 'test comment'
      }).should.have.property('error', true);

      checkValues({
        user_id: 1,
        product_id: 1,
        rating: 'abc',
        comment: 'test comment'
      }).should.have.property('error', true);

      checkValues({
        user_id: 1,
        product_id: 1,
        rating: 11,
        comment: 'test comment'
      }).should.have.property('error', true);

      checkValues({
        user_id: 1,
        product_id: 1,
        rating: -1,
        comment: 'test comment'
      }).should.have.property('error', true);
    });
  });
});

describe('/api/review', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(db.connection, 'connect').returns(function() {
    });
    sandbox.stub(db, 'q').returns(Promise.resolve());
  });

  after(() => {
    sandbox.restore();
  });

  it('should 200, if valid params', done => {
    server.post(url)
      .send({user_id: 1, product_id: 1, rating: 1, comment: 'test comment'})
      .end((e, res) => {
        res.status.should.equal(200);
        done();
      });
  });

  it('should 400, if invalid user_id', done => {
    server.post(url)
      .send({user_id: 'abc', product_id: 1, rating: 1, comment: 'test comment'})
      .end((e, res) => {
        res.status.should.equal(400);
        done();
      });
  });

  it('should 400 if invalid product_id', done => {
    server.post(url)
      .send({user_id: 1, product_id: 'abc', rating: 1, comment: 'test comment'})
      .end((e, res) => {
        res.status.should.equal(400);
        done();
      });
  });
});
