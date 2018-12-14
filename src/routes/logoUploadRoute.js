const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const logger = require('../lib/logger');
// our image schema
const CompanyLogo = require('../model/company-logo');

// ultimately what our program is exporting for this file
const router = module.exports = new express.Router();

// ROUTE(S)
router.post('/company-logo/upload', jsonParser, (request, response, next) => {
  if (!request.body) {
    logger.log(logger.INFO, '400 - upload request invalid');
    return response.sendStatus(400);
  } // else if there is something to try and upload ...
  const newLogo = new CompanyLogo();
  newLogo.img.data = fs.readFileSync(request.body.image);
  newLogo.img.contentType = 'image/png';
  return newLogo.save()
    .then((logo) => {
      logger.log(logger.INFO, '200 - image saved');
      response.json(logo);
    })
    .catch(error => next(error));
});
