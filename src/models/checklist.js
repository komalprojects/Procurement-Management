const mongoose = require('mongoose');

const checkListSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  questions: { type: [String], required: true },
  answers: { type: [String], required: true },
  image: { type: String },
});

const Checklist = mongoose.model('Checklist', checkListSchema);

module.exports = Checklist;
