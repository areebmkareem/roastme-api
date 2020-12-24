const express = require('express');
const router = new express.Router();

const User = require('../../models/user');
const auth = require('../../controllers/auth');
const isEmailVerified = require('../../controllers/emailVerified');

const defaultLimit = 10;
const defaultSkip = 0;

/**
 * @api {GET} /contacts Get User Contacts
 * @apiGroup Contacts
 * @apiName GetUserContacts
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/contacts', auth, isEmailVerified, async (req, res) => {
  const user = req.user;
  const query = req.query;
  const projection = {isEmailVerified: 0, contacts: 0, userName: 0};
  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };
  let data = {
    ...options,
  };
  data.contacts = await User.find({_id: user.contacts}, projection).limit(options.limit).skip(options.skip);
  res.send({success: true, data});
});

/**
 * @api {GET} /contacts/:userName Search User By User Name
 * @apiGroup Contacts
 * @apiName SearchUserByUserName
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/contacts/:userName', auth, isEmailVerified, async (req, res) => {
  const userName = req.params.userName;
  const user = req.user;
  const query = req.query;
  const projection = {isEmailVerified: 0, contacts: 0, userName: 0};
  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };
  let data = {
    ...options,
  };
  data.contacts = await User.find({userName}, projection).limit(options.limit).skip(options.skip);
  res.send({success: true, data});
});

module.exports = router;
