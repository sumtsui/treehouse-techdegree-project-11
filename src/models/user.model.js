const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('../../config');
const bcrypt = require('bcrypt');

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

UserSchema.pre('save', function (next) {
  // 'this' refer to the data Mongoose will write to the database
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function (email, password, callback) {
  let error = new Error('Authentication failed');
  User
    .findOne({ email: email })
    .exec((err, user) => {
      if (err || !user) callback(error); 
      else {
        bcrypt.compare(password, user.password, (err, r) => {
          if (r) callback(null, user);
          else callback(error);
        })
      }
    })
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

module.exports = User;