'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const SubAssembly = require('../model/sub-assembly');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// ==========================================================================
// CREATE Sub-Assembly
// ==========================================================================
router.post('/subassemblies', jsonParser, (request, response, next) => {
  if (!request.body) {
    logger.log(logger.INFO, '400 | invalid request');
    return response.sendStatus(400);
  }
  return SubAssembly.create(
    request.body.subId,
    request.body.subPart,
    request.body.subVersion,
    request.body.subQuantity,
    request.body.subMinutes,
  )
    .then((subAssembly) => {
      logger.log(logger.INFO, 'SUCCESS - Creating Sub-Assembly', subAssembly);
      return response.json({ subAssembly });
    })
    .catch(next);
});
