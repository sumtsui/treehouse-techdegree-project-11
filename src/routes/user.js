const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

/*
  User Route
*/

// create new user
router.post('/', async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details.map(i => i.message).join(', '));

  req.body.password = await bcrypt.hash(req.body.password, 10);
  const user = new User(req.body);
  
  user
    .save((err, user) => {
      if (err) {
        if (err.code === 11000) err.message = 'User already registered';
        err.status = 400;
        next(err);
      }
      else {
        const token = user.generateAuthToken();
        res.set({
          'x-auth-token': token,
          'Location': '/'
        }).send(201);
      }
    })
});

// get currently authenticated user



module.exports = router;