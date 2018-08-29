const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const joi = require('joi');

/*
  Authentication Route
*/

// user login
router.post('/', (req, res, next) => {
  // validate input from client
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details.map(i => i.message).join(', '));

  // authenticate against database
  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err) {
      err.status = 400;
      err.message = 'Invalid email or password';
      return next(err);
    }
    const token = user.generateAuthToken();
    res.set({
      'x-auth-token': token,
      'Location': '/'
    }).send(200);
  });
});

function validate(user) {
  const schema = {
    email: joi.string().max(255).required().email(),
    password: joi.string().max(255).required()
  };
  return joi.validate(user, schema, { abortEarly: false });
}



module.exports = router;