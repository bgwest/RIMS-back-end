'use strict';

const mongoose = require('mongoose');

const companyLogoSchema = mongoose.Schema({
  buffer: {
    type: Buffer,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  encoding: {
    type: String,
    required: true,
  },
});

const CompanyLogo = module.exports = mongoose.model('companyLogo', companyLogoSchema);

CompanyLogo.create = (buffer, mimetype, originalname, encoding) => {
  return new CompanyLogo({
    buffer, mimetype, originalname, encoding,
  }).save();
};
