const { Manufacturer } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
// const { manMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const env = require('../config/env.config');

const createManufacturer = async (ManufacturerBody) => {
  const manufacturer = await Manufacturer.create(ManufacturerBody);
  return manufacturer;
};

module.exports = {
  createManufacturer,
};
