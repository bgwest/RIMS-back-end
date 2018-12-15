'use strict';

const mongoose = require('mongoose');

const companyLogoSchema = mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
});

const CompanyLogo = mongoose.model('companyLogo', companyLogoSchema);

CompanyLogo.create = (data, contentType) => {
  return new CompanyLogo({ data, contentType }).save();
};
