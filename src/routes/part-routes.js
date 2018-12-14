'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const Part = require('../model/part');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();
const logger = require('../lib/logger');

// ==========================================================================
// CREATE Part
// ==========================================================================
router.post('/parts', jsonParser, (request, response, next) => {
  if (!request.body) {
    logger.log(logger.INFO, '400 | invalid request');
    return response.sendStatus(400);
  }
  if (!request.body.subIDRef) {
    return Part.create(
      request.body.partId,
      request.body.partDescription,
      request.body.partSub,
      request.body.partSrc,
      request.body.partMfgNum,
      request.body.partPrice,
      request.body.partCategory,
      request.body.partLocation,
      request.body.partCount,
      request.body.partLongLead,
      request.body.partNotes,
    )
      .then((part) => {
        logger.log(logger.INFO, 'SUCCESS - Creating Standalone Part', part);
        return response.json({ part });
      })
      .catch(next);
  } // else ... if subIDRef is not blank
  return new Part(request.body).save()
    .then((part) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      response.json(part);
    })
    .catch(error => next(error));
});
