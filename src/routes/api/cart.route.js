const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { cartController } = require('../../controllers');
const { cartValidation } = require('../../validations');
const { authenticate } = require('../../middlewares/auth.middleware');

const cartRouter = express.Router();

cartRouter.post('/', authenticate, validate(cartValidation.addProductToCart), cartController.addProductToCart);
cartRouter.get('/me', authenticate, validate(cartValidation.getCart), cartController.getMyCart);
module.exports = cartRouter;
