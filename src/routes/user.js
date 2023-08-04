const express = require('express');
const User = require('../models/user');
const route = new express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

//1st user register as admin
route.post('/users', async (req, res) => {
  if (req.body.role !== 'ADMIN') {
    res.status(400).send('role must be admin');
  }
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//login user
route.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredential(req.body);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(`error:${err}`);
  }
});

//after login register new users with diff role
route.post('/users/register', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findByRole(currentUser, req.body);
    const registerUser = new User(user);
    const token = await registerUser.generateAuthToken();
    res.status(201).send({ registerUser, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(`error:${err}`);
  }
});

//get all user under particular user 
route.get('/users', auth, async (req, res) => {
  try {
    const id = await req.user._id;
    const result = await User.find({ 'createdBy.createById': new mongoose.Types.ObjectId(id) });
    await res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = route;
