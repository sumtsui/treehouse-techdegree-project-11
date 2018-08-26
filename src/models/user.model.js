const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('../../config');

const UserSchema = Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => validateEmail(v),
      message: 'Invaild email address'
    }
  },
  password: {
    type: String,
    required: true
  }
});

function validateUser(user) {
  const schema = {
    fullName: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema, { abortEarly: false });
}

function validateEmail(email) {
  return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

// declare User instance method
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, }, config.jwtPrivateKey);
  return token;
}

const User = mongoose.model('User', UserSchema);

module.exports.User = User;
module.exports.validate = validateUser;