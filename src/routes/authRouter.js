'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const basicAuthMiddleware = require('../lib/basicAuthMiddleware');
const bearerAuthMiddleware = require('../lib/bearerAuthMiddleware');
const recoveryAnswerAuth = require('../lib/recoveryAnswerAuth');
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
  // on-signup squash any capital letters to help users with recoveryAnswer
  // case sensitive is another deterent but may also cause user frustration
  // handle toLowerCase on both signup and forgot my password
  request.body.recoveryAnswer = request.body.recoveryAnswer.toLowerCase();
  return Account.create(
    request.body.username,
    request.body.password,
    request.body.recoveryQuestion,
    // NOTE -- need to adjust recoveryAnswer so it has at least basic base64 encoding when
    // being sent on original signup
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
router.post('/forgot-pw', jsonParser, recoveryAnswerAuth, (request, response, next) => {
  // steps
  //   1. receive user obj with username, recovery question, and recovery answer
  //   2. use username to find User Object
  //   3. return User Object
  //   4. test that recovery answer matches given recovery answer with bcrypt.compare
  //   5. if security answer and security question match, generate random password
  //   6. update user account schema with the new random pw
  //   7. return that random password with base 64 encryption to front-end in return json object
  //   8. render new random password on screen for copy/paste to login to account and directly
  //      to a "change my password" page

  // at this point -- request.body has been parsed and recoveryAnswerAuth
  // has either found an account and returned it or username was incorrect and it rejected it
  if (!request.account) {
    return next(new HttpError(401, 'AUTH | invalid'));
  }
  // request.body = username, recoveryAnswer, recoveryQuestion
  return request.account.pValidateRecoveryAnswer(request.body)
    .then((temporaryPassword) => {
      // if successful
      return response.json({ temporaryPassword });
    })
    .catch((error) => {
      return next(error);
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
