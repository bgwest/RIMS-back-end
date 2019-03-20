'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../lib/logger');
const handleRequestingUser = require('../lib/handleRequestingUser');
// long name so shortened for readability
const getAFAH = require('../lib/getAccountFromArbitraryHeader');
const roles = require('../model/access/roles/roles');

// const bearerAuthMiddleware = require('../lib/bearerAuthMiddleware');
const Account = require('../model/account');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

const dbQuery = require('../lib/query');

const runUserQuery = (callback) => {
  const findStuff = dbQuery.find(Account, 'username recoveryQuestion isAdmin');
  // run async query
  const returnData = dbQuery.query(findStuff, function (data, error) { //eslint-disable-line
    if (error) {
      return error;
    }
    if (data) {
      // convert accessCodes into iterable array
      return callback(Object.values(data));
    }
  });
};

// bearerAuthMiddleware, jsonParser, (request, response, next)
// NOTE: need additional validation to ensure only admin can do this...
router.get('/accounts', jsonParser, handleRequestingUser, getAFAH, (request, response, next) => { // eslint-disable-line
  if (!request.arbitrary && !request.account) {
    logger.log(logger.INFO, '400 | invalid request');
    return response.sendStatus(400);
  } // else, if middleware added arbitrary value
  // return all users in db
  let query = runUserQuery((callback, error) => { // eslint-disable-line
    // console.log('error');
    // console.log(error);
    // console.log('callback');
    // console.log(callback);
    return response.json({ dbQuery: callback });
  });
  // needs additional error handling but commit this base query for now
  // front end should be able to receive this json and populate user list with
  // the delete buttons
});

router.get('/roles', jsonParser, (request, response, next) => {
  return response.json(roles);
});
