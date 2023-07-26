const InspectionChecklist = require('../models/inspectionChecklist');
const express = require('express');
const routes = new express.Router();
const auth = require('../middleware/auth');

// Create a new checklist for particular order by inspection manager
routes.post('/inspectionChecklist/:id', auth, async (req, res) => {
  if (!['INSPECTION_MANAGER'].includes(req.user.role)) {
    res.status(400).send({ error: `you can't edit checklist` });
  }
  try {
    const { id } = req.params;
    const { name, fields } = req.body;
    const newChecklist = new InspectionChecklist({
      checklistId: id,
      name,
      fields,
    });

    const savedChecklist = await newChecklist.save();
    res.send(savedChecklist);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get checklist by inspection checklist ID
routes.get('/inspectionChecklist', auth, async (req, res) => {
  try {
    if (!['INSPECTION_MANAGER', 'PROCUREMENT_MANAGER'].includes(req.user.role)) {
      res.status(400).send({ error: `you can't view checklist` });
    }
    const checklist = await InspectionChecklist.findOne({});
    if (!checklist) {
      res.status(404).json({ error: 'Checklist not found' });
    } else {
      res.status(200).json(checklist);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve checklist' });
  }
});

module.exports = routes;
