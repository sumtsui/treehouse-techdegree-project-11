const express = require('express');
const router = express.Router();
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('../../config');

/*
  Authentication Route
*/

router.post('/', async (req, res, next) => {
  // validate input from client
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details.map(i => i.message).join(', '));

  // attend to find user by email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  // attend to match passwords
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  // create json web token
  const token = user.generateAuthToken();
  // set the 'x-auth-token'prop in header to the token
  res.set({
    'x-auth-token': token,
    'Location': '/'
  }).send(201);
});

function validate(user) {
  const schema = {
    email: joi.string().max(255).required().email(),
    password: joi.string().max(255).required()
  };
  return joi.validate(user, schema, { abortEarly: false });
}



module.exports = router;