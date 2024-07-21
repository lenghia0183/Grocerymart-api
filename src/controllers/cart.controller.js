const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');
const { cartMessage } = require('../messages');
const { REQUEST_USER_KEY } = require('../constants');

const addProductToCart = catchAsync(async (req, res) => {
  const userId = req[REQUEST_USER_KEY].id;
  await cartService.addProductToCart(req.body, userId);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, cartMessage().ADD_TO_CART_SUCCESS));
});

const getMyCart = catchAsync(async (req, res) => {
  const userId = req[REQUEST_USER_KEY].id;
  const requestQuery = req.query;
  const cart = await cartService.getCartByUserId(requestQuery, userId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().FIND_LIST_SUCCESS, cart));
});

const clearMyCart = catchAsync(async (req, res) => {
  const userId = req[REQUEST_USER_KEY].id;
  await cartService.clearMyCart(userId);
  res.status(httpStatus.OK).json(response(httpStatus.NO_CONTENT, cartMessage().CLEAR_CART_SUCCESS));
});

module.exports = {
  addProductToCart,
  getMyCart,
  clearMyCart,
};
