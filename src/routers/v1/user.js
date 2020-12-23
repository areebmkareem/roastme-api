const express = require('express');
const router = new express.Router();
const validator = require('validator');

const User = require('../../models/user');
const auth = require('../../controllers/auth');
const sendVerificationEmail = require('../../emails/account').sendVerificationEmail;
const generateOtp = require('../../helper/generateOtp');
const {getResponseMessage, getErrorMessages} = require('../../constants');

router.post('/register', async (req, res) => {
  const {name, password, email} = req.body;
  const isEmail = validator.isEmail(email);
  const hasRequiredFields = name && password && email;
  if (!isEmail) throw 'Invalid email address';
  if (hasRequiredFields) {
    const otp = {
      value: generateOtp(),
      createdAt: new Date(),
    };
    let user = new User({
      name,
      email,
      password,
      otp,
    });

    let data = await user.generateTokenId();
    await data.user.save();
    sendVerificationEmail(user.email, user.name, user.otp.value);
    res.send({success: true, data, message: getResponseMessage.registered});
  } else throw getErrorMessages.requiredFields;
});

router.get('/user', auth, async (req, res) => {
  res.send({success: true, data: req.user});
});

router.post('/verify-otp', auth, async (req, res) => {
  const user = req.user;
  const otpValidated = user.otp.value === req.body.otp;
  if (user.isEmailVerified) throw new Error('User is already verified.');
  if (otpValidated) {
    const filter = {email: user.email};
    const updateDoc = {
      $set: {
        isEmailVerified: true,
      },
      $unset: {
        otp: 1,
      },
    };
    const response = await User.updateOne(filter, updateDoc);
    if (response.nModified) res.send({success: true, message: 'OTP verified successfully.'});
    else throw new Error('OTP verification failed');
  } else res.send({success: true, message: 'Invalid OTP Code.'});
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  let response = await User.getCredentials(email, password);
  let data = await response.generateTokenId();
  res.send({success: true, data});
});

router.get('/logout', auth, async (req, res) => {
  let {user, token} = req;
  user.tokens = user.tokens.filter((data) => data.token !== token);
  user.save();
  res.send({success: true, message: 'Successfully logged out!'});
});
module.exports = router;
