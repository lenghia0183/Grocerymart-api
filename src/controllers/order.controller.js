const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');
const { orderMessage } = require('../messages');
const { REQUEST_USER_KEY } = require('../constants');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, orderMessage().CREATE_SUCCESS, order));
});

const callBackZalo = catchAsync(async (req, res) => {
  const callbackResponse = await orderService.callBackZalo(req.body);
  res.json(callbackResponse);
});

module.exports = {
  createOrder,
  callBackZalo,
};
