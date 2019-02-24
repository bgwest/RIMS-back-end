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
    .then((toReturn) => {
      const token = toReturn.tokenSeed;
      const { username, recoveryQuestion, isAdmin } = toReturn;
      logger.log(logger.INFO, 'Responding with a 200 status code and a TOKEN');
      return response.json({
        token, username, recoveryQuestion, isAdmin,
      });
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
  // at this point, basicAuthMiddleware has ran pValidatePassword
  return request.account.pCreateToken()
    .then((toReturn) => {
      const token = toReturn.tokenSeed;
      const { username, recoveryQuestion, isAdmin } = toReturn;
      logger.log(logger.INFO, 'Responding with a 200 status code and a TOKEN');
      return response.json({
        token, username, recoveryQuestion, isAdmin,
      });
    })
    // this point will be skipped to if pCreateToken has failed on password validation
    .catch(next);
});

// ==================================================================
// Change PW
// ==================================================================
router.get('/reset-pw', basicAuthMiddleware, (request, response, next) => {
  // Step 1: Find account and validate PW
  //   - Throw error if current PW doesn't validate
  if (!request.account) {
    return next(new HttpError(401, 'AUTH | invalid'));
  }
  // at this point, basicAuthMiddleware has ran pValidatePassword
  // next ...
  //   - run new hash
  //   - "pCreateToken"
  //   - update account
  //   - return account
  let newPassword = request.headers.basic2;
  newPassword = Buffer.from(newPassword, 'base64').toString();
  return request.account.pUpdatePassword(newPassword)
    .then((updatedAccount) => {
      newPassword = null;
      const token = updatedAccount.tokenSeed;
      const { username, recoveryQuestion, isAdmin } = updatedAccount;
      logger.log(logger.INFO, 'Responding with a 200 status code and a TOKEN');
      return response.json({
        token, username, recoveryQuestion, isAdmin,
      });
    }).catch((error) => {
      newPassword = null;
      return new Error(error);
    });
});

// ==================================================================
// Forgot pw
// ==================================================================
router.post('/forgot-pw', jsonParser/* , bearerAuthMiddleware */, (request, response, next) => {
  // testing wiring
  console.log('ROUTE -- /FORGOT-PW -- HIT');
  return response.json({
    wiredUp: true,
    returnedBody: request.body,
  });
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
      const { username, recoveryQuestion, isAdmin } = toReturn;
      logger.log(logger.INFO, 'Responding with a 200 status code and a TOKEN');
      return response.json({
        token, username, recoveryQuestion, isAdmin,
      });
    })
    .catch(next);
});
