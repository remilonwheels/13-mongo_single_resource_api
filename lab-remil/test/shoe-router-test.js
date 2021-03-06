'use strict';
'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Shoe = require('../model/shoe.js');

process.env.MONGODB_URI = 'mongodb://localhost/shoetest';
require('../server.js');

const url = `http://localhost:${process.env.PORT}`;
const shoeExample = {
  model: 'Air Swag',
  brand: 'Nike',
};

describe('Shoe Routes', function() {
  describe('POST: /api/shoe', function() {
    describe('with a valid body', function() {
      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a shoe', done => {
        request.post(`${url}/api/shoe`)
        .send(shoeExample)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body.model).to.equal(shoeExample.model);
          expect(res.body.brand).to.equal(shoeExample.brand);
          this.tempShoe = res.body;
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a 400 status code', done => {
        request.post(`${url}/api/shoe`)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          this.tempShoe = res.body;
          done();
        });
      });
    });
  });

  describe('GET: /api/shoe/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        shoeExample.timestamp = new Date();
        new Shoe(shoeExample).save()
        .then( shoe => {
          this.tempShoe = shoe;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a shoe', done => {
        request.get(`${url}/api/shoe/${this.tempShoe._id}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body.model).to.equal(this.tempShoe.model);
          expect(res.body.brand).to.equal(this.tempShoe.brand);
          done();
        });
      });
    });

    describe('with an invalid id', function() {

      it('should return a 404 code', done => {
        request.get(`${url}/api/shoe/badID`)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: /api/shoe/:id', function() {
    describe('with a valid id and body', function() {
      before( done => {
        shoeExample.timestamp = new Date();
        new Shoe(shoeExample).save()
        .then( shoe => {
          this.tempShoe = shoe;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return an update shoe', done => {
        let newShoe = {
          model: 'new model',
          brand: 'new brand',
        };
        request.put(`${url}/api/shoe/${this.tempShoe._id}`)
        .send(newShoe)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.tempShoe._id.toString());
          expect(res.body.model).to.equal(newShoe.model);
          expect(res.body.brand).to.equal(newShoe.brand);
          done();
        });
      });
    });

    describe('with no id', function() {
      before( done => {
        shoeExample.timestamp = new Date();
        new Shoe(shoeExample).save()
        .then( shoe => {
          this.tempShoe = shoe;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a 404 status', done => {
        let newShoe = {
          model: 'new model',
          brand: 'new brand',
        };
        request.put(`${url}/api/shoe/`)
        .send(newShoe)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with a bad body', function() {
      before( done => {
        shoeExample.timestamp = new Date();
        new Shoe(shoeExample).save()
        .then( shoe => {
          this.tempShoe = shoe;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a 400 status', done => {
        request.put(`${url}/api/shoe/${this.tempShoe._id}`)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/shoe/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        shoeExample.timestamp = new Date();
        new Shoe(shoeExample).save()
        .then( shoe => {
          this.tempShoe = shoe;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempShoe) {
          Shoe.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return the deleted shoe and a 204 status', done => {
        request.delete(`${url}/api/shoe/${this.tempShoe._id}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });

    });
  });
});
