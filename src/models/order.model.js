const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      // required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'reject', 'shipping', 'success', 'canceled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Bank'],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ['MoMo', 'ZaloPay', 'VnPay'],
      required: function () {
        return this.paymentMethod === 'Bank';
      },
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: function () {
        return this.paymentMethod === 'Bank';
      },
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Order', orderSchema);
