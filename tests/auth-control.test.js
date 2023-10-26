const index = require('../routes/index');

const request = require('supertest');
const express = require('express');
const app = express();
require('./mongoConfigTesting');

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

test.only('sign up route works', (done) => {
  request(app)
    .post('/sign-up')
    .type('form')
    .send({
      username: 'nick',
      password: 'PaSsWord1!',
      confirm_password: 'PaSsWord1!'
    })
    .expect(200, done);
});

test('sign up to log in route works', (done) => {
  request(app)
    .post('/sign-up')
    .type('form')
    .send({
      username: 'nick',
      password: 'PaSsWord1!',
      confirm_password: 'PaSsWord1!'
    })
    .then(() => {
      request(app).post('/log-in').type('form').send({
        username: 'nick',
        password: 'PaSsWord1!'
      });
    })
    .expect(200, done);
});

test('log in route works', (done) => {
  request(app)
    .post('/log-in')
    .type('form')
    .send({
      username: 'nick',
      password: 'PaSsWord1!'
    })
    .expect(200, done);
});
