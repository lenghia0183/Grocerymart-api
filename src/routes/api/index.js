const express = require('express');

const apiRoute = express.Router();

const listRoutesApi = [
  {
    path: '/users',
    route: require('./user.route'),
  },
  {
    path: '/auth',
    route: require('./auth.route'),
  },
  {
    path: '/product',
    route: require('./product.route'),
  },
  {
    path: '/category',
    route: require('./category.route'),
  },
  {
    path: '/manufacturer',
    route: require('./manufacturer.route'),
  },
  {
    path: '/address',
    route: require('./address.route'),
  },
  {
    path: '/cart',
    route: require('./cart.route'),
  },
  {
    path: '/favorite',
    route: require('./favorite.route'),
  },
];

listRoutesApi.forEach((route) => {
  apiRoute.use(route.path, route.route);
});

module.exports = apiRoute;
