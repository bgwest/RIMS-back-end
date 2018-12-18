const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

// image handler
const multer = require('multer');
// store in memory to push to DB
const storage = multer.memoryStorage();
const upload = multer({ storage });

const jsonParser = bodyParser.json();
const logger = require('../lib/logger');
// our image schema
const CompanyLogo = require('../model/company-logo');

// ultimately what our program is exporting for this file
const router = module.exports = new express.Router();

// ROUTE(S)
router.post('/company-logo/upload', upload.single('image'), (request, response, next) => {
  // still in dev - needs error handling and resolve why mongo properties 'data, contentType'
  // appear to save, but then end up missing from actual DB entry.
  console.log('request.file');
  console.log(request.file);
  const data = request.file.buffer;
  const contentType = request.file.mimetype;
  return CompanyLogo.create(
    data,
    contentType,
  ).then((logo) => {
    logger.log(logger.INFO, '200 - image saved');
    response.json(logo);
  }).catch(error => next(error));
});
