const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    cartId: Joi.string().custom(objectId),
    // address: Joi.string().custom(objectId),
    shippingFee: Joi.number().required(),
    paymentMethod: Joi.string().required(),
    paymentGateway: Joi.string().required(),
    note: Joi.string().allow(null, ''),
    status: Joi.string().allow(null, ''),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    userId: Joi.string().custom(objectId),
    cartId: Joi.string().custom(objectId),
    address: Joi.string().allow(null, ''),
    note: Joi.string().allow(null, ''),
    status: Joi.string().allow(null, ''),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      cartId: Joi.string().custom(objectId),
      address: Joi.string().allow(null, ''),
      note: Joi.string().allow(null, ''),
      status: Joi.string().allow(null, ''),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
