const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  customerName: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  status: {
    type: String,
  },
  checklist: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
