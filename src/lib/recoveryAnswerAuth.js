'use strict';

const HttpError = require('http-errors');
const Account = require('../model/account');

// setup exports
module.exports = {};

const recoveryAnswerAuth = (request, response, next) => {
  const { username, recoveryAnswer, recoveryQuestion } = request.body;

  // ensure we have all we need to continue
  // also helps ensure people are 'probably' using the form and not just sending post/get requests
  // at this route
  if (!username || !recoveryAnswer || !recoveryQuestion) {
    return next(new HttpError(400, 'INVALID REQUEST'));
  }

  const decodedAnswer = Buffer.from(recoveryAnswer, 'base64').toString();
  return Account.findOne({ username })
    .then((accountFound) => {
      request.account = accountFound;
      return next();
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

module.exports.recoveryAnswerAuth = recoveryAnswerAuth;
