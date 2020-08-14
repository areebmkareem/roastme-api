const express = require('express');
const router = new express.Router();

const User = require('../../models/user');
const auth = require('../../controllers/auth');

router.post('/register', async (req, res) => {
  const { name, password, email } = req.body;
  if (name && password && email) {
    let user = new User({
      name,
      email,
      password,
    });
    await User.checkIfUseAlreadyExist(email);
    let data = await user.generateTokenId();
    res.send({ success: true, token: data.token });
  } else throw 'Empty data';
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let response = await User.getCredentials(email, password);
  let data = await response.generateTokenId();
  res.send({ success: true, token: data.token });
});

router.get('/logout', auth, async (req, res) => {
  let { user, token } = req;
  user.tokens = user.tokens.filter((data) => data.token !== token);
  user.save();
  res.send({ success: true, message: 'Successfully logged out!' });
});
module.exports = router;
