const express = require('express');
const router = new express.Router();

const User = require('../../models/user');
const auth = require('../../controllers/auth');
const isEmailVerified = require('../../controllers/emailVerified');

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
    limit: parseInt(query.limit),
    skip: parseInt(query.skip),
  };
  const data = await User.find({_id: user.contacts}, projection).limit(options.limit).skip(options.skip);
  res.send({success: true, data});
});

module.exports = router;
