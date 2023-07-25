const express = require('express');
const User = require('../models/user');
const route = new express.Router();
const auth = require('../middleware/auth');

route.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

route.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredential(req.body);
    console.log('login user' + user);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(`error:${err}`);
  }
});

route.post('/users/register', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findByRole(currentUser, req.body);
    const registerUser = new User(user);
    const token = await registerUser.generateAuthToken();
    await res.status(201).send({ registerUser, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(`error:${err}`);
  }
});

route.get('/users', auth, async (req, res) => {
  try {
    const id = await req.user._id;
    console.log({ createdBy: { createById: id } });
    const result = await User.find({ createdBy: { createById: id } });
    const allRestult = await User.find({});
    console.log(result, allRestult);
    await res.status(201).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = route;
