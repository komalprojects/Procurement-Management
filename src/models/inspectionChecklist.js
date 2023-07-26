const mongoose = require('mongoose');

const inspectionCheckList = mongoose.Schema({
  checklistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CheckList',
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
});

const InspectionChecklist = mongoose.model('InspectionChecklist', inspectionCheckList);

module.exports = InspectionChecklist;
