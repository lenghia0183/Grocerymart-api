const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addProductToCart = {
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1),
    productId: Joi.string().custom(objectId).required(),
    selectedWeight: Joi.string().valid('100g', '500g', '1kg'),
  }),
};

const getMyCart = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
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

const clearMyCart = {
  params: Joi.object().keys({}),
};

module.exports = {
  addProductToCart,
  getMyCart,
  updateCart,
  clearMyCart,
};
