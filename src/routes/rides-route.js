const express = require('express');
const bodyParser = require('body-parser');
const ridesController = require('../domain/rides/controller/rides-controller');
const { validateCreateBody } = require('../middleware/validate-body-ride');

const ridesRouter = express.Router();
const jsonParser = bodyParser.json();

ridesRouter
  .route('/')
  .get(ridesController.getRides)
  .post(jsonParser, validateCreateBody, ridesController.createRide);
ridesRouter.route('/:id').get(ridesController.getRideById);

module.exports = ridesRouter;
