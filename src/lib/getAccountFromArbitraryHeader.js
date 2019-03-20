'use strict';

const HttpError = require('http-errors');
const Account = require('../model/account');

module.exports = (request, response, next) => {
  const { arbitrary } = request;

  // ensure we have all we need to continue
  // also helps ensure people are 'probably' using the form and not just sending post/get requests
  // at this route
  if (!arbitrary) {
    return next(new HttpError(400, 'INVALID REQUEST'));
  }

  const username = arbitrary;

  return Account.findOne({ username })
    .then((accountFound) => {
      request.account = accountFound;
      return next();
    })
    .catch((error) => {
      return next(new Error(error));
    });
};
