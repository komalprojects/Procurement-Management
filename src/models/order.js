const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderDate: {
    type: Date,
  },
  customerName: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  status: {
    type: String,
  },
  productList: [
    {
      productId: { type: String },
      productName: { type: String },
      quantity: { type: Number },
    },
  ],
  checklist: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
