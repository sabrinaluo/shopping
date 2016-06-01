/* eslint-env mocha */
/* eslint-disable camelcase*/
'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const should = chai.should();
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');
const db = require('./../../db');
const review = rewire('./../../api/review');
const checkValues = review.__get__('checkValues');
const checkUserProduct = review.__get__('checkUserProduct');

let url = '/api/review';

describe('review module', () => {
  describe('private: checkValues', () => {
    it('should return error null, if data is valid', () => {
      should.equal(null, checkValues({
        user_id: 1,
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).message);
    });

    it('should return error true, if user_id is not a positive integer', () => {
      checkValues({
        user_id: undefined,
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).message.should.not.equal(null);

      checkValues({
        user_id: 'abc',
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).message.should.not.equal(null);

      checkValues({
        user_id: 1.5,
        product_id: 1,
        rating: 1,
        comment: 'test comment'
      }).message.should.not.equal(null);
    });

    it('should return error true, if product_id is not a positive integer', () => {
      checkValues({
        user_id: 1,
        product_id: 'abc',
        rating: 1,
        comment: 'test comment'
      }).message.should.not.equal(null);

      checkValues({
        user_id: 1,
        product_id: -1,
        rating: 1,
        comment: 'test comment'
      }).message.should.not.equal(null);
    });

    it('should return error true, if rating is not an integer within 0-9', () => {
      checkValues({
        user_id: 1,
        product_id: 1,
        rating: undefined,
        comment: 'test comment'
      }).message.should.not.equal(null);

      checkValues({
        user_id: 1,
        product_id: 1,
        rating: 'abc',
        comment: 'test comment'
      }).message.should.not.equal(null);

      checkValues({
        user_id: 1,
        product_id: 1,
        rating: 11,
        comment: 'test comment'
      }).message.should.not.equal(null);

      checkValues({
        user_id: 1,
        product_id: 1,
        rating: -1,
        comment: 'test comment'
      }).message.should.not.equal(null);
    });
  });

  describe('private: checkUserProduct', ()=> {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should be fulfilled, if db response valid data', ()=> {
      sandbox.stub(db, 'q').returns(Promise.resolve([{
        user_id: 1,
        usertype: 'customer',
        product_id: 2
      }]));
      return checkUserProduct().should.be.fulfilled;
    });

    it('should be rejected, if db response=[]', () => {
      sandbox.stub(db, 'q').returns(Promise.resolve([]));
      return checkUserProduct().should.be.rejectedWith('user or product does not exist');
    });

    it('should be rejected, if usertype is not customer', () => {
      sandbox.stub(db, 'q').returns(Promise.resolve([{usertype: 'merchant'}]));
      return checkUserProduct().should.be.rejectedWith('invalid user, only customer can post a review');
    });
  });
});

describe('/api/review', () => {
  let sandbox;
  let server;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(db.connection, 'connect').returns(function() {
    });
    server = supertest(require('./../../app'));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should 200, if valid params', done => {
    sandbox.stub(db, 'q').returns(Promise.resolve([{
      user_id: 1,
      usertype: 'customer',
      product_id: 2
    }]));
    server.post(url)
      .send({user_id: 1, product_id: 1, rating: 1, comment: 'test comment'})
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });

  it('should 400, if usertype is not customer', done => {
    sandbox.stub(db, 'q').returns(Promise.resolve([{
      user_id: 1,
      usertype: 'merchant',
      product_id: 2
    }]));
    server.post(url)
      .send({user_id: 1, product_id: 1, rating: 1, comment: 'test comment'})
      .end((err, res) => {
        res.status.should.equal(400);
        done();
      });
  });

  it('should 400, if user or product not exists', done => {
    sandbox.stub(db, 'q').returns(Promise.resolve([]));
    server.post(url)
      .send({user_id: 100, product_id: 1, rating: 1, comment: 'test comment'})
      .end((err, res) => {
        res.status.should.equal(400);
        done();
      });
  });

  it('should 400, if invalid user_id', done => {
    sandbox.stub(db, 'q').returns(Promise.resolve([{
      user_id: 1,
      usertype: 'customer',
      product_id: 2
    }]));
    server.post(url)
      .send({user_id: 'abc', product_id: 1, rating: 1, comment: 'test comment'})
      .end((err, res) => {
        res.status.should.equal(400);
        done();
      });
  });

  it('should 400 if invalid product_id', done => {
    server.post(url)
      .send({user_id: 1, product_id: 'abc', rating: 1, comment: 'test comment'})
      .end((err, res) => {
        res.status.should.equal(400);
        done();
      });
  });
});
