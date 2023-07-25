const Order = require('../models/order');
const express = require('express');
const routes = new express.Router();
const auth = require('../middleware/auth');

routes.post('/order', auth, async (req, res) => {
  if (req.user.role === 'PROCUREMENT_MANAGER') {
    const order = new Order({
      ...req.body,
      owner: req.user._id,
    });
    try {
      const data = await order.save();
      await res.status(201).send(data);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    throw new Error('you cant add orders');
  }
});

module.exports = routes;
