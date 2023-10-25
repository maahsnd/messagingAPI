const index = require('../routes/users');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

test('log in route works', (done) => {
  request(app)
    .post('/log-in')
    .type('form')
    .send({
      username: '',
      password: ''
    })
    .expect(200, done);
});

test('sign up routes works', (done) => {
  request(app)
    .post('/sign-up')
    .type('form')
    .send({
      username: '',
      password: '',
      confirm_password: ''
    })
    .expect(200, done);
});
