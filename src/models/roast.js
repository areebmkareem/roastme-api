const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  status: {
    require: true,
    type: Number,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

let User = new mongoose.model('User', userSchema);

module.exports = User;
