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
    } else res.send({ error: true, message: 'User not found' });
  } else res.send({ error: true, message: 'token expired' });
});

module.exports = auth;
