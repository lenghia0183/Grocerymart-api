const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    selectedWeight: {
      type: String,
      enum: ['100g', '500g', '1kg'],
      required: true,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('CartDetail', cartDetailSchema);
