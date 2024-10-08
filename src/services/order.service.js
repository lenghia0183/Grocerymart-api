const { Order } = require('../models');
const { cartService } = require('../services');
const paymentService = require('./payment.service');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { cartMessage } = require('../messages');

const createOrder = async (orderBody) => {
  const { userId, cartId, addressId, note, paymentMethod, paymentGateway, shippingFee = 0 } = orderBody;
  const cart = await cartService.getCartById(cartId);
  const totalOrderMoney = +cart?.totalMoney + +shippingFee;

  const order = await Order.create({
    userId,
    cartId,
    addressId,
    note,
    status: 'pending',
    shippingFee,
    paymentMethod,
    paymentGateway: paymentMethod === 'Bank' ? paymentGateway : undefined,
    isPaid: paymentMethod === 'Bank' ? false : undefined,
    totalAmount: totalOrderMoney,
  });

  if (paymentGateway === 'MoMo') {
    const paymentResponse = await paymentService.paymentWithMoMo(order);
    return paymentResponse;
  }
};

module.exports = {
  createOrder,
};
