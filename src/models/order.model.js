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
      required: true,
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Order', orderSchema);
