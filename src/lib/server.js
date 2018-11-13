'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('../routes/authRouter');
const logger = require('./logger');
const loggerMiddleware = require('./logger-middleware');
const errorMiddleware = require('./error-middleware');

const app = express();

app.use(authRouter);

// GLOBAL MIDDLEWARE
app.use(cors({
  credential: true,
}));

// middleware
app.use(loggerMiddleware);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - catch-all/default routes (routes was not found)');
  return response.sendStatus(404);
});

const server = module.exports = {};
let internalServer = null;

server.start = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        return internalServer = app.listen(process.env.PORT, () => { // eslint-disable-line
        logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
      });
    });
};

server.stop = () => {
  return mongoose.disconnect()
    .then(() => {
      return internalServer.close(() => {
        logger.log(logger.INFO, 'The server is OFF.');
      });
    });
};
