'use strict';

const chai = require('chai');
chai.use(require('sinon-chai')).should();

const supertest = require('supertest');

describe('api', () => {
  let server;

  before(() => {
    server = supertest(require('./../../app'));
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
