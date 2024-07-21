const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addProductToCart = {
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1),
    productId: Joi.string().custom(objectId).required(),
    selectedWeight: Joi.string().valid('100g', '500g', '1kg'),
  }),
};

const getCarts = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      cartDetailId: Joi.array().allow(null, ''),
      userId: Joi.string().custom(objectId),
      totalMoney: Joi.number().allow(null, ''),
    })
    .min(1),
};

const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  addProductToCart,
  getCarts,
  getCart,
  updateCart,
  deleteCart,
};
