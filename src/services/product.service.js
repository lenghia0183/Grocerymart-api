const { Product } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const env = require('../config/env.config');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

module.exports = {
  createProduct,
};
