const express = require('express');
const User = require('../models/user');
const route = new express.Router();

route.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    await res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = route;
