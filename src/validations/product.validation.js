const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.object().pattern(Joi.string(), Joi.number()).required(),
    description: Joi.string().allow(null, ''),
    images: Joi.array().items(Joi.string()),
    categoryId: Joi.string().custom(objectId),
    manufacturerId: Joi.string().custom(objectId),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    price: Joi.object().pattern(Joi.string(), Joi.number()),
    description: Joi.string().allow(null, ''),
    images: Joi.array().items(Joi.string()),
    categoryId: Joi.string().custom(objectId),
    manufacturerId: Joi.string().custom(objectId),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
