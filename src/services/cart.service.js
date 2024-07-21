const { Cart, CartDetail } = require('../models');
const { productService } = require('.');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { cartMessage } = require('../messages');

const getCartByUserId = async (queryRequest, userId) => {
  const { limit = 10, page = 1 } = queryRequest;
  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return;
  }
  const totalCartDetails = await CartDetail.countDocuments({ _id: { $in: cart.cartDetails } });

  let cartDetails = await CartDetail.find({ _id: { $in: cart.cartDetails } })
    .populate('productId')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  // add selectedPrice to cartDetails
  cartDetails = cartDetails.map((detail) => {
    const selectedPrice = detail.productId.prices.find((price) => price.weight === detail.selectedWeight).price;
    return {
      ...detail.toObject(),
      selectedPrice,
    };
  });

  const detailResults = {
    limit: +limit,
    totalResult: totalCartDetails,
    totalPage: Math.ceil(totalCartDetails / +limit),
    currentPage: +page,
    currentResult: cartDetails.length,
  };

  const results = { cartDetails, cartTotal: cart.totalMoney, ...detailResults };
  return results;
};

const addProductToCart = async (cartBody, userId) => {
  const { productId, quantity = 1, selectedWeight } = cartBody;

  const product = await productService.getProductById(productId);
  const selectedPrice = product.prices.find((priceOpt) => {
    return priceOpt.weight === selectedWeight;
  }).price;

  const cart = await Cart.findOne({ userId }).populate([
    {
      path: 'cartDetails',
      populate: {
        path: 'productId',
      },
    },
  ]);

  if (!cart) {
    const newCartDetail = await CartDetail.create({
      productId,
      quantity,
      selectedWeight,
      totalMoney: quantity * selectedPrice,
    });
    await Cart.create({ userId, cartDetails: [newCartDetail._id], totalMoney: newCartDetail.totalMoney });
    return;
  }

  const cartDetail = cart?.cartDetails.find((cartDetail) => {
    return cartDetail.productId.id.toString() === productId && cartDetail?.selectedWeight === selectedWeight;
  });

  if (cartDetail?.quantity + quantity > 100 || quantity > 100) {
    throw new ApiError(httpStatus.BAD_REQUEST, cartMessage().MAX_QUANTITY);
  }

  if (cartDetail) {
    cartDetail.quantity += quantity;
    cartDetail.totalMoney += quantity * selectedPrice;
    cart.totalMoney += cartDetail?.totalMoney;
    await cartDetail.save();
  } else {
    const newCartDetail = await CartDetail.create({
      productId,
      quantity,
      selectedWeight,
      totalMoney: quantity * selectedPrice,
    });
    cart.cartDetails.push(newCartDetail._id);
    cart.totalMoney += newCartDetail?.totalMoney;
  }
  await cart.save();
};

const clearMyCart = async (userId) => {
  const cart = await Cart.findOneAndDelete({ userId });
  if (cart) {
    await CartDetail.deleteMany({ _id: { $in: cart.cartDetails } });
  }
};



module.exports = {
  addProductToCart,
  getCartByUserId,
  clearMyCart,
};
