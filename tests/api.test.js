//eslint-disable-next-line
const request = require('supertest');
const assert = require('assert');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');
//eslint-disable-next-line
describe('API tests', () => {
  //eslint-disable-next-line
  before(done => {
    db.serialize(err => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  //eslint-disable-next-line
  describe('GET /health', () => {
    //eslint-disable-next-line
    it('should return health', done => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  //eslint-disable-next-line
    describe('GET /rides', () => {
    //eslint-disable-next-line
      it('should return 200 OK', done => {
      request(app)
        .get('/rides')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
    //eslint-disable-next-line
      it('should return 200 OK paging', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: 'testDriver',
        driver_name: 'testRider',
        driver_vehicle: 'testVehicle'
      };
      request(app)
        .post('/rides')
        .send(body)
        .then(() => {
          request(app)
            .get('/rides?page=0&limit=1')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
              assert(res.body.totalItems === 1);
            })
            .expect(200, done);
        });
    });

    //eslint-disable-next-line
      it('should return 200 OK paging ERR', done => {
      request(app)
        .get('/rides?page=a&limit=b')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(
          200,
          {
            error_code: 'SERVER_ERROR',
            message: 'Unknown error'
          },
          done
        );
    });
  });

  //eslint-disable-next-line
  describe('GET /rides/id', () => {
    //eslint-disable-next-line
    it('should return 200 OK', done => {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
    //eslint-disable-next-line
    it('should return 200 OK Avoid SQL Injection', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: 'testDriver',
        driver_name: 'testRider',
        driver_vehicle: 'testVehicle'
      };
      request(app)
        .post('/rides')
        .send(body)
        .then(() => {
          request(app)
            .get(`/rides/1 or 1=1`)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(
              200,
              {
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find any rides'
              },
              done
            );
        });
    });
  });

  //eslint-disable-next-line
  describe('POST /rides', () => {
    //eslint-disable-next-line
    it('should return 200 ERROR relate to start latitude and longitude', done => {
      const body = {
        start_lat: '-91',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: 'testDriver',
        driver_name: 'testRider',
        driver_vehicle: 'testVehicle'
      };
      const expectResult = JSON.stringify({
        error_code: 'VALIDATION_ERROR',
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      });
      request(app)
        .post('/rides')
        .send(body)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, expectResult, done);
    });

    //eslint-disable-next-line
    it('should return 200 ERROR relate to end latitude and longitude ', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '91',
        end_long: '180',
        rider_name: 'testDriver',
        driver_name: 'testRider',
        driver_vehicle: 'testVehicle'
      };
      const expectResult = JSON.stringify({
        error_code: 'VALIDATION_ERROR',
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      });
      request(app)
        .post('/rides')
        .send(body)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, expectResult, done);
    });

    //eslint-disable-next-line
    it('should return 200 ERROR relate to riderName', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: '',
        driver_name: 'testRider',
        driver_vehicle: 'testVehicle'
      };
      const expectResult = JSON.stringify({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string'
      });
      request(app)
        .post('/rides')
        .send(body)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, expectResult, done);
    });

    //eslint-disable-next-line
    it('should return 200 ERROR relate to driverName', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: 'testRider',
        driver_name: '',
        driver_vehicle: 'testVehicle'
      };
      const expectResult = JSON.stringify({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string'
      });
      request(app)
        .post('/rides')
        .send(body)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, expectResult, done);
    });

    //eslint-disable-next-line
    it('should return 200 ERROR relate to driverVehicle', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: 'testRider',
        driver_name: 'testRider',
        driver_vehicle: ''
      };
      const expectResult = JSON.stringify({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string'
      });
      request(app)
        .post('/rides')
        .send(body)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, expectResult, done);
    });

    //eslint-disable-next-line
    it('should return 200 OK', done => {
      const body = {
        start_lat: '-90',
        start_long: '-180',
        end_lat: '90',
        end_long: '180',
        rider_name: 'testRider',
        driver_name: 'testRider',
        driver_vehicle: 'testVehicle'
      };
      request(app)
        .post('/rides')
        .send(body)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
  });
});
