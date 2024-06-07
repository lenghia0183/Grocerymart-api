const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createComment = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    content: Joi.string(),
    rating: Joi.number().required(),
  }),
};

const getComments = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createComment,
  getComments,
};
