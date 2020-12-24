const express = require('express');
const router = new express.Router();
const validator = require('validator');

const User = require('../../models/user');
const auth = require('../../controllers/auth');
const checkRequiredFields = require('../../helper/checkRequiredFields');
const isEmailVerified = require('../../controllers/emailVerified');
const sendVerificationEmail = require('../../emails/account').sendVerificationEmail;
const generateOtp = require('../../helper/generateOtp');
const {getResponseMessage, getErrorMessages} = require('../../constants');

/**
 * @api {POST} /register Create New User
 * @apiGroup Users
 * @apiName CreateUser
 * @apiParam {String} fullName      Mandatory Fullname.
 * @apiParam {String} userName      Mandatory Lastname.
 * @apiParam {String} password      Mandatory Password.
 * @apiParam {String} email         Mandatory Email.
 */
router.post('/register', async (req, res) => {
  checkRequiredFields(['fullName', 'userName', 'password', 'email'], req.body);

  const {fullName, userName, password, email} = req.body;
  const isEmail = validator.isEmail(email);

  if (!isEmail) throw 'Invalid email address';
  const otp = {
    value: generateOtp(),
    createdAt: new Date(),
  };
  let user = new User({
    fullName,
    userName,
    email,
    password,
    otp,
  });

  let data = await user.generateTokenId();
  await data.user.save();
  sendVerificationEmail(user.email, user.name, user.otp.value);
  res.send({success: true, data, message: getResponseMessage.registered});
});

/**
 * @api {GET} /user Get User Details
 * @apiGroup Users
 * @apiName GetUserDetails
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/user', auth, isEmailVerified, async (req, res) => {
  res.send({success: true, data: req.user});
});

/**
 * @api {POST} /verify-otp Verify Email With OTP
 * @apiGroup Users
 * @apiName VerifyEmailByOTP
 * @apiParam {String}  otp     Mandatory OTP.
 * @apiHeader {String} token  Mandatory users unique token.
 */

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

/**
 * @api {POST} /login Login User With Email and Password
 * @apiGroup Users
 * @apiName SignInWithEmailAndPassword
 * @apiParam {String}  email     Mandatory Email.
 * @apiParam {String}  password  Mandatory Password.
 */

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  let response = await User.getCredentials(email, password);
  let data = await response.generateTokenId();
  res.send({success: true, data});
});

/**
 * @api {GET} /logout Logout User
 * @apiGroup Users
 * @apiName LogoutUser
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/logout', auth, async (req, res) => {
  let {user, token} = req;
  user.tokens = user.tokens.filter((data) => data.token !== token);
  user.save();
  res.send({success: true, message: 'Successfully logged out!'});
});
module.exports = router;
