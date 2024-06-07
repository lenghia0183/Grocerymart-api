const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('CartDetail', cartDetailSchema);
