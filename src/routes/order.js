const Order = require('../models/order');
const express = require('express');
const routes = new express.Router();
const auth = require('../middleware/auth');

//create orders
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

//get all orders
routes.get('/order', async (req, res) => {
  const allOrders = await Order.find({});
  res.send(allOrders);
});

//update order by id where PROCUREMENT_MANAGER can update all details other users can update status
routes.patch('/order/:id', auth, async (req, res) => {
  const taskFelids = ['customerName', 'shippingAddress', 'status', 'checklist'];
  const modelKeys = Object.keys(req.body);
  const isValid = modelKeys.every((task) => taskFelids.includes(task));

  if (!isValid) {
    return res.status(400).send({ error: 'invalid Order' });
  }

  try {
    if (req.user.role === 'PROCUREMENT_MANAGER') {
      const orderData = await Order.findOne({ _id: req.params.id, owner: req.user._id });

      if (!orderData) {
        return res.status(404).send('task not found');
      }
      modelKeys.forEach((el) => (orderData[el] = req.body[el]));
      await orderData.save();
      res.send({ body: orderData, message: 'Successfully updated' });
    } else if (['ADMIN', 'INSPECTION_MANAGER'].includes(req.user.role)) {
      const orderData = await Order.findOne({ _id: req.params.id });
      if (!orderData) {
        return res.status(404).send('task not found');
      }
      orderData['status'] = req.body['status'];
      await orderData.save();
      res.send({ body: orderData, message: 'Successfully updated' });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = routes;
