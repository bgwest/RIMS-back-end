const fs = require('fs');
const express = require('express');

// image handler
const multer = require('multer');
// store in memory to push to DB
const storage = multer.memoryStorage();
const upload = multer({ storage });
const logger = require('../lib/logger');
// our image schema
const CompanyLogo = require('../model/company-logo');

// ultimately what our program is exporting for this file
const router = module.exports = new express.Router();

// ROUTE(S)
router.post('/company-logo/upload', upload.single('image'), (request, response, next) => {
  // this route needs better error handling
  console.log('request.file');
  console.log(request.file);
  if (request.file.mimetype !== 'image/png' && request.file.mimetype !== 'image/jpeg') {
    // not perfect, but helps to disallow incorrect file types
    // currently we accept png's and jpeg's
    logger.log(logger.INFO, '400 | incorrect mimetype');
    return response.sendStatus(400);
  }
  const {
    buffer, mimetype, originalname, encoding,
  } = request.file; // eslint-disable-line prefer-const

  // for now, also write file to local FS to test buffer stream
  // this can be eventually removed but good for now
  fs.writeFile('./uploads/company-logo.png', buffer, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`${originalname} saved - local dir ../../uploads/`);
  });

  return CompanyLogo.create(
    buffer,
    mimetype,
    originalname,
    encoding,
  ).then((logo) => {
    logger.log(logger.INFO, '200 - image saved');
    response.json(logo);
  }).catch(error => next(error));
});
