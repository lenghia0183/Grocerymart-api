const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { orderController } = require('../../controllers');
const { orderValidation } = require('../../validations');
const { authenticate } = require('../../middlewares/auth.middleware');

const orderRouter = express.Router();

orderRouter.post('/', authenticate, validate(orderValidation.createOrder), orderController.createOrder);
orderRouter.put(
  '/:orderId',
  authenticate,
  validate(orderValidation.updateOrderStatus),
  orderController.updateOrderStatus,
);

module.exports = orderRouter;
