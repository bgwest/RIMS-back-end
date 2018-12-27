'use strict';

const HttpError = require('http-errors');
const jsonWebToken = require('jsonwebtoken');
const Account = require('../model/account');

const promisify = curryFunction => (...args) => {
  return new Promise((resolve, reject) => {
    curryFunction(...args, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

module.exports = (request, response, next) => {
  // uncomment for debugging
  // console.log('BACK-END REQUEST');
  // console.log(request.headers);
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH | invalid request'));
  }
  const token = request.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return next(new HttpError(400, 'AUTH | invalid request'));
  }
  return promisify(jsonWebToken.verify)(token, process.env.APP_SECRET)
    .then((decryptedToken) => {
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH | invalid request'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
