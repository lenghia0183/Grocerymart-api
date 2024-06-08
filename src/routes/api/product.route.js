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

productRouter.get('/', validate(productValidation.getProducts), productController.getProducts);

productRouter.get('/:productId', validate(productValidation.getProduct), productController.getProduct);

productRouter.delete(
  '/:productId',
  authenticate,
  authorize('admin'),
  validate(productValidation.deleteProduct),
  productController.deleteProduct,
);

module.exports = productRouter;
