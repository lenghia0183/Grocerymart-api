const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');
const { orderMessage } = require('../messages');
const { REQUEST_USER_KEY } = require('../constants');

const createOrder = catchAsync(async (req, res) => {
  const userId = req[REQUEST_USER_KEY].id;
  const order = await orderService.createOrder(req.body, userId);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, orderMessage().CREATE_SUCCESS, order));
});

const callBackZalo = catchAsync(async (req, res) => {
  const callbackResponse = await orderService.callBackZalo(req.body);
  res.json(callbackResponse);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const user = req[REQUEST_USER_KEY];

  const status = req.body.status;
  const order = await orderService.updateOrderStatus(req.params.orderId, status, user);
  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().UPDATE_SUCCESS, order));
});

module.exports = {
  createOrder,
  callBackZalo,
  updateOrderStatus,
};
