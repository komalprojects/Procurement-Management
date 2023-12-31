const mongoose = require('mongoose');

const checkListSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  name: {
    type: String,
  },
  fields: [
    {
      type: {
        type: String,
      },
      name: {
        type: String,
      },
      options: [
        {
          type: String,
        },
      ],
      isRequired: {
        type: Boolean,
      },
    },
  ],

  image: { type: String },
});

const Checklist = mongoose.model('Checklist', checkListSchema);

module.exports = Checklist;
