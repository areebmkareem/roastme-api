const jwt = require('jsonwebtoken');
const User = require('../modals/user');
const asyncMiddleware = require('./async');
const auth = asyncMiddleware(async (req, res, next) => {
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
  } else 'token expired';
});

module.exports = auth;
