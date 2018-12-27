'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const basicAuthMiddleware = require('../lib/basicAuthMiddleware');
const bearerAuthMiddleware = require('../lib/bearerAuthMiddleware');
const Account = require('../model/account');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// ==================================================================
// SIGN-UP
// ==================================================================
router.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username) {
    logger.log(logger.INFO, '400 | invalid request');
    return response.sendStatus(400);
  }
  return Account.create(
    request.body.username,
    request.body.password,
    request.body.recoveryQuestion,
    request.body.recoveryAnswer,
    request.body.isAdmin,
  )
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH | creating TOKEN');
      return account.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH | returning a 200 code and a token');
      return response.json({ token });
    })
    .catch(next);
});

// ==================================================================
// LOGIN
// ==================================================================
router.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(401, 'AUTH | invalid request'));
  }
  return request.account.pCreateToken()
    .then((toReturn) => {
      const token = toReturn.tokenSeed;
      const isAdmin = toReturn.isAdmin; // eslint-disable-line prefer-destructuring
      logger.log(logger.INFO, 'Responding with a 200 status code and a TOKEN');
      return response.json({ token, isAdmin });
    })
    .catch(next);
});

// ==================================================================
// token auth
// ==================================================================
router.get('/token-auth', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(401, 'AUTH | invalid request'));
  }
  return request.account.pCreateToken()
    .then((toReturn) => {
      const token = toReturn.tokenSeed;
      const isAdmin = toReturn.isAdmin; // eslint-disable-line prefer-destructuring
      logger.log(logger.INFO, 'Responding with a 200 status code and a TOKEN');
      return response.json({ token, isAdmin });
    })
    .catch(next);
});
