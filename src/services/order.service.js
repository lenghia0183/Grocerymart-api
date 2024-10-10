const { Order } = require('../models');
const { cartService } = require('../services');
const { orderMessage } = require('../messages');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOrder = async (orderBody) => {
  const paymentService = require('./payment.service');

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
  } else if (paymentGateway === 'ZaloPay') {
    const paymentResponse = await paymentService.paymentWithZaloPay(order);
    return paymentResponse;
  }
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, orderMessage().NOT_FOUND);
  }
  return order;
};

module.exports = {
  createOrder,
  getOrderById,
};
