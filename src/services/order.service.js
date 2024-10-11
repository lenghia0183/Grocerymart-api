const { Order } = require('../models');
const { cartService } = require('../services');
const { orderMessage, authMessage } = require('../messages');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOrder = async (orderBody, userId) => {
  const paymentService = require('./payment.service');

  const { cartId, addressId, note, paymentMethod, paymentGateway, shippingFee = 0 } = orderBody;
  const cart = await cartService.getCartById(cartId);

  if (cart?.status === 'inactive') {
    throw new ApiError(httpStatus.BAD_REQUEST, orderMessage().INVALID_CART);
  }

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
    const paymentResponse = await paymentService.paymentWithMoMo(order, cart);
    return paymentResponse;
  } else if (paymentGateway === 'ZaloPay') {
    const paymentResponse = await paymentService.paymentWithZaloPay(order, cart);
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

const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  Object.assign(order, updateBody);
  await order.save();
  return order;
};

const updateOrderStatus = async (orderId, status, user) => {
  const order = await getOrderById(orderId);

  const role = user.role;
  if (role === 'user') {
    if (order.userId.toString() !== user?.id) {
      throw new ApiError(httpStatus.FORBIDDEN, orderMessage().FORBIDDEN);
    }

    if (status === 'canceled') {
      if (order.status === 'pending') {
        order.status = status;
        await order.save();
      } else {
        throw new ApiError(httpStatus.FORBIDDEN, orderMessage().CANNOT_CANCEL_ORDER);
      }
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, orderMessage().FORBIDDEN);
    }
  }

  if (role === 'admin') {
    order.status = status;
    await order.save();
  }

  return order;
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderById,
  updateOrderStatus,
};
