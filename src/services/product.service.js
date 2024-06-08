const { Product } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const env = require('../config/env.config');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

const getProductByKeyWord = async (requestQuery) => {
  const {
    limit = 10,
    page = 1,
    keyword = '',
    sortBy = 'createdAt',
    manufacturerId,
    categoryId,
    minPrice,
    maxPrice,
    minRating,
  } = requestQuery;

  const sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return { [field]: option === 'desc' ? -1 : 1 };
  });

  const sortObject = Object.assign(...sort);

  const query = {
    $and: [
      {
        $or: [
          { name: { $regex: new RegExp(keyword, 'i') } },
          { slug: { $regex: new RegExp(keyword, 'i') } },
          { description: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
    ],
  };

  if (categoryId) {
    query.$and.push({ categoryId });
  }

  if (manufacturerId) {
    query.$and.push({ manufacturerId });
  }

  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) {
      priceFilter.$gte = minPrice;
    }
    if (maxPrice) {
      priceFilter.$lte = maxPrice;
    }
    query.$and.push({ 'prices.price': priceFilter });
  }

  if (minRating) {
    query.$and.push({ ratings: { $gte: minRating } });
  }

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const products = await Product.find(query)
    .select('name description images prices manufacturer category ratings')
    .populate([
      {
        path: 'manufacturerId',
        select: 'name',
      },
      {
        path: 'categoryId',
        select: 'name',
      },
    ])
    .skip(skip)
    .limit(limit)
    .sort(sortObject);

  const totalSearch = await Product.countDocuments(query);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: products.length,
  };

  const results = { products, ...detailResult };
  return results;
};

module.exports = {
  createProduct,
  getProductByKeyWord,
};
