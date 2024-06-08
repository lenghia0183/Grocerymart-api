const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { productMessage } = require('../messages');

const createProduct = catchAsync(async (req, res) => {
  if (req.files) {
    req.body['images'] = req.files.map((file) => file.path);
  }
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, productMessage().CREATE_SUCCESS, product));
});

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProductByKeyWord(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

module.exports = {
  createProduct,
  getProducts,
};
