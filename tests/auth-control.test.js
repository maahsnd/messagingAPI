const index = require('../routes/index');

const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const app = express();
require('dotenv').config();
require('../mongoConfig');

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

test('sign up route works', (done) => {
  request(app)
    .post('/sign-up')
    .type('form')
    .send({
      username: 'nick1',
      password: 'PaSsWord11!',
      confirm_password: 'PaSsWord11!'
    })
    .expect(200, done);
});

test('sign up to log in route works', (done) => {
  request(app).post('/sign-up').type('form').send({
    username: 'nick',
    password: 'PaSsWord1!',
    confirm_password: 'PaSsWord1!'
  }),
    request(app)
      .post('/log-in')
      .type('form')
      .send({
        username: 'nick',
        password: 'PaSsWord1!'
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
