'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpError = require('http-errors');

const TOKEN_SEED_LENGTH = 128;
const HASH_ROUNDS = 10;

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  recoveryHash: {
    type: String,
    required: true,
  },
  recoveryQuestion: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      const handOff = {};
      handOff.tokenSeed = account.tokenSeed;
      handOff.username = account.username;
      handOff.recoveryQuestion = account.recoveryQuestion;
      handOff.isAdmin = account.isAdmin;
      return handOff;
    })
    .then((parsedAccount) => {
      const objectToSend = {};
      objectToSend.tokenSeed = jsonWebToken.sign({
        tokenSeed: parsedAccount.tokenSeed,
      }, process.env.APP_SECRET);
      objectToSend.username = parsedAccount.username;
      objectToSend.recoveryQuestion = parsedAccount.recoveryQuestion;
      objectToSend.isAdmin = parsedAccount.isAdmin;
      return objectToSend;
    })
    .catch((error) => {
      throw error;
    });
}

function pUpdatePassword(newPW) {
  return bcrypt.hash(newPW, HASH_ROUNDS)
    .then((newHash) => {
      // null out originally passed PW
      newPW = null; // eslint-disable-line no-param-reassign
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      this.passwordHash = newHash;
      this.tokenSeed = tokenSeed;
      return this.save();
    })
    .then((account) => {
      const objectToSend = {};
      objectToSend.tokenSeed = jsonWebToken.sign({
        tokenSeed: account.tokenSeed,
      }, process.env.APP_SECRET);
      objectToSend.username = account.username;
      objectToSend.recoveryQuestion = account.recoveryQuestion;
      objectToSend.isAdmin = account.isAdmin;
      return objectToSend;
    })
    .catch((error) => {
      return new Error(error);
    });
  // this.passwordHash =
}

function pValidatePassword(unhashedPassword) {
  return bcrypt.compare(unhashedPassword, this.passwordHash)
    .then((compareResult) => {
      if (!compareResult) {
        throw new HttpError(401, 'error');
      }
      return this;
    })
    .catch(console.error);
}

function pValidateRecoveryAnswer() {

}

accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pValidatePassword = pValidatePassword;
accountSchema.methods.pUpdatePassword = pUpdatePassword;
accountSchema.methods.pValidateRecoveryAnswer = pValidateRecoveryAnswer;

const Account = module.exports = mongoose.model('account', accountSchema);

function hashRecovery(recoveryAnswer, callback) {
  const bcryptReturn = bcrypt.hashSync(recoveryAnswer, HASH_ROUNDS);
  return callback(bcryptReturn);
}

function getRecoveryHash(recoveryHash) {
  return recoveryHash;
}

Account.create = (username, password, recoveryQuestion, recoveryAnswer, isAdmin) => {
  const recoveryHash = hashRecovery(recoveryAnswer, getRecoveryHash);
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; //eslint-disable-line
      recoveryAnswer = null; //eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        tokenSeed,
        passwordHash,
        recoveryHash,
        isAdmin,
        recoveryQuestion,
      }).save();
    });
};
