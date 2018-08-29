const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const Joi = require('joi');

/*
  User Route /api/users
*/

// get currently authenticated user
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).send(user);
  } catch(err) {
    error.status = 400;
    next(error);
  }
})

// create new user
router.post('/', async (req, res, next) => {
  // validate user input
  const { error } = validateInput(req.body);
  if (error) {
    error.status = 400;
    error.message = error.details.map(i => i.message).join(', ');
    next(error);
  }

  // create new user document object
  const user = new User(req.body);
  
  user
    .save((err, user) => {
      if (err) {
        if (err.code === 11000) err.message = 'User already registered';
        err.status = 400;
        return next(err);
      }
      const token = user.generateAuthToken();
      res.set({
        'x-auth-token': token,
        'Location': '/'
      }).send(201);
    })
});

function validateInput(user) {
  const schema = {
    fullName: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema, { abortEarly: false });
}

module.exports = router;