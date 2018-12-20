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
  console.log('request.file');
  console.log(request.file);
  const originalNameStripped = request.file.originalname.split('.')[0];

  if (originalNameStripped !== 'company-logo') {
    logger.log(logger.INFO, '400 | logo must be named: company-logo');
    return response.sendStatus(400);
  }

  if (request.file.mimetype !== 'image/png' && request.file.mimetype !== 'image/jpeg') {
    // not perfect, but helps to disallow incorrect file types
    // currently we accept png's and jpeg's
    logger.log(logger.INFO, '400 | incorrect mimetype');
    return response.sendStatus(400);
  }

  // once the mimetype is verified, save the originalname without file extension
  // this makes it easier to replace all files named company logo
  // currently, only 1 company logo will be allowed and replaced if re-uploaded
  request.file.originalname = originalNameStripped;

  const {
    buffer, mimetype, originalname, encoding,
  } = request.file; // eslint-disable-line prefer-const

  const incomingImage = {
    buffer, mimetype, originalname, encoding, 
  };
  
  const query = { originalname };

  // for now, also write file to local FS to test buffer stream
  // this can be eventually removed but good for now
  fs.writeFile('./uploads/company-logo.png', buffer, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`${originalname} saved - local dir ../../uploads/`);
  });

  // { upsert: true } allows us to create the intial entry if it does not already exist
  // otherwise, image being sent will just be replaced
  // currently, this reduces complexity of managing multiple logos in the front-end
  // we can re-visit in future if needed
  // not using promise with this query or it causes double entries to be created
  return CompanyLogo.findOneAndUpdate(query, incomingImage, { upsert: true }, (err, doc) => { // eslint-disable-line
    if (err) {
      return response.send(500, { error: err });
    }
    if (doc) {
      logger.log(logger.INFO, '200 - image saved');
      return response.json(doc);
    }
  });
});
