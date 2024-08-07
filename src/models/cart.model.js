const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartDetail',
        required: true,
      },
    ],
    totalMoney: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Cart', cartSchema);
