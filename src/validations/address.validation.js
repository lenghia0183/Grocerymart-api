const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAddress = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    street: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
  }),
};

const updateAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    street: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
  }),
};

const getAddresses = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(objectId),
  }),
};

const deleteAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAddress,
  updateAddress,
  getAddresses,
  getAddress,
  deleteAddress,
};
