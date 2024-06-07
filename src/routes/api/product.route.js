const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { uploadService } = require('../../services');
const productRouter = express.Router();

productRouter.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadService.uploadImage.array('images', 5),
  validate(productValidation.createProduct),
  productController.createProduct,
);

module.exports = productRouter;
