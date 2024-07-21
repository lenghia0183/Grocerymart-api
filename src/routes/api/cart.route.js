const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { cartController } = require('../../controllers');
const { cartValidation } = require('../../validations');
const { authenticate } = require('../../middlewares/auth.middleware');

const cartRouter = express.Router();

cartRouter.post('/', authenticate, validate(cartValidation.addProductToCart), cartController.addProductToCart);
cartRouter.get('/me', authenticate, validate(cartValidation.getMyCart), cartController.getMyCart);
cartRouter.delete('/me', authenticate, validate(cartValidation.clearMyCart), cartController.clearMyCart);
module.exports = cartRouter;
