const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async (req, res, next) => {
  const token = req.header('token');
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    let user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (user) {
      req.user = user;
      req.token = token;
      next();
    } else throw 'User not found';
  } else throw 'token expired';
};

module.exports = auth;
