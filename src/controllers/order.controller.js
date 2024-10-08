const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');
const { orderMessage } = require('../messages');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, orderMessage().CREATE_SUCCESS, order));
});

module.exports = {
  createOrder,
};
