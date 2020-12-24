const emailVerified = async (req, res, next) => {
  const user = req.user;
  if (user.isEmailVerified) next();
  else throw new Error('Please verify your email');
};

module.exports = emailVerified;
