const ridesService = require('../service/rides-service');
const PaginationUtils = require('../../../utils/PaginationUtils');
const loggers = require('../../../loggers');

exports.getRides = async (req, res) => {
  try {
    loggers.info('[RidesController] getRides');
    const { db } = req;
    const pageRequest = PaginationUtils.getPageRequest(req);
    const pagingRides = await ridesService.getRides(pageRequest, db);
    if (pagingRides.totalItems < 1) {
      return res.send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides'
      });
    }
    return res.send(pagingRides);
  } catch (e) {
    loggers.error(e.code);
    return res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error'
    });
  }
};

exports.getRideById = async (req, res) => {
  try {
    loggers.info('[RidesController] getRideById');
    const { db } = req;
    const rides = await ridesService.getRideById(req.params.id, db);
    if (rides.length < 1) {
      return res.send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides'
      });
    }
    return res.send(rides);
  } catch (e) {
    loggers.error(e.code);
    return res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error'
    });
  }
};

exports.createRide = async (req, res) => {
  try {
    loggers.info('[RidesController] create Ride');
    const { db } = req;
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;
    const reqRide = {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      riderName,
      driverName,
      driverVehicle
    };
    const rideSaved = await ridesService.createRide(reqRide, db);
    return res.send(rideSaved);
  } catch (e) {
    loggers.error(e.code);
    return res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error'
    });
  }
};
