const CheckList = require('../models/checklist');
const express = require('express');
const routes = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middleware/auth');

//add vehicle image in checklist
const image = multer({
  limits: { files: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('please upload image file'));
    }
    console.log('image', req);
    cb(undefined, true);
  },
});

routes.put(
  '/checklist/:orderId/image',
  image.single('image'),
  auth,
  async (req, res) => {
    if (!['INSPECTION_MANAGER', 'PROCUREMENT_MANAGER'].includes(req.user.role)) {
      res.status(400).send({ error: 'you cant add/edit checklist' });
    }
    const { orderId } = req.params;
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    const checklist = await CheckList.findOne({ orderId });
    checklist.image = buffer;
    await checklist.save();
    res.send(checklist);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//get image by id
routes.get('/checklist/:id/image', async (req, res) => {
  try {
    const checklist = await CheckList.findById(req.params.id);
    if (!checklist | !checklist.image) {
      throw new Error('image or checklist not found');
    }

    res.set('Content-Type', 'image/png');
    res.send(checklist.image);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Create a new checklist for particular order
routes.post('/checklist', auth, async (req, res) => {
  if (!['PROCUREMENT_MANAGER'].includes(req.user.role)) {
    res.status(400).send({ error: 'you cant add/edit checklist' });
  }
  try {
    const { orderId, name, fields } = req.body;
    const newChecklist = new CheckList({
      orderId,
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

// Get checklist by order ID
routes.get('/checklist/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const checklist = await CheckList.findOne({ order: orderId }).populate('order');
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
