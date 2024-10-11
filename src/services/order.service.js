const { Order } = require('../models');
const { cartService } = require('../services');
const { orderMessage } = require('../messages');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const getOrdersByUserId = async (userId, requestQuery) => {
  const { limit = 10, page = 1, sortBy = 'createdAt:desc', status } = requestQuery;

  const sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return { [field]: option === 'desc' ? -1 : 1 };
  });

  const sortObject = Object.assign(...sort);

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    userId,
  };
  if (status) {
    filter.status = status;
  }

  let orders = await Order.find(filter).populate('cartId').sort(sortObject).skip(skip).limit(limitNumber).lean();

  orders = await Promise.all(
    orders.map(async (order) => {
      const cart = await cartService.getCartById(order.cartId);
      order.products = cart.cartDetails;
      delete order.cartId;
      return order;
    }),
  );

  const totalOrders = await Order.countDocuments({ userId });

  const totalPages = Math.ceil(totalOrders / limitNumber);

  const detailResult = {
    limit: limitNumber,
    totalResult: totalOrders,
    totalPage: totalPages,
    currentPage: pageNumber,
    currentResult: orders.length,
  };
  const result = { orders, ...detailResult };

  return result;
};

const getOrders = async (requestQuery) => {
  const { limit = 10, page = 1, sortBy = 'createdAt:desc', status } = requestQuery;

  const sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return { [field]: option === 'desc' ? -1 : 1 };
  });

  const sortObject = Object.assign(...sort);

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};
  if (status) filter.status = status;

  let orders = await Order.find(filter).populate('cartId').sort(sortObject).skip(skip).limit(limitNumber).lean();

  orders = await Promise.all(
    orders.map(async (order) => {
      const cart = await cartService.getCartById(order.cartId);
      order.products = cart.cartDetails;
      delete order.cartId;
      return order;
    }),
  );

  const totalOrders = await Order.countDocuments();

  const totalPages = Math.ceil(totalOrders / limitNumber);

  const detailResult = {
    limit: limitNumber,
    totalResult: totalOrders,
    totalPage: totalPages,
    currentPage: pageNumber,
    currentResult: orders.length,
  };
  const result = { orders, ...detailResult };

  return result;
};

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
  getOrdersByUserId,
  getOrders,
};
