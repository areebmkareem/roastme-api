const express = require('express');
const router = new express.Router();

const User = require('../../models/user');
const ContactRequest = require('../../models/contactRequest');
const auth = require('../../controllers/auth');
const transactionController = require('../../controllers/transaction');

const checkRequiredFields = require('../../helper/checkRequiredFields');

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
  const data = {};
  const user = req.user;
  const query = req.query;
  const projection = {isEmailVerified: 0, contacts: 0, userName: 0};
  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };
  const filter = {
    _id: user.contacts,
  };

  data.contacts = await User.find(filter, projection).limit(options.limit).skip(options.skip);
  data.totalCount = await User.countDocuments(filter);
  res.send({success: true, data});
});

/**
 * @api {GET} /contacts/:userName Search User By User Name
 * @apiGroup Contacts
 * @apiName SearchUserByUserName
 * @apiHeader {String} token  Mandatory users unique token.
 * @apiDescription This api is in beta state you have to enter the full keyword for proper search result.
 */

router.get('/contacts/:userName', auth, isEmailVerified, async (req, res) => {
  const data = {};
  const userName = req.params.userName;
  const query = req.query;
  const projection = {isEmailVerified: 0, contacts: 0, userName: 0};

  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };
  const filter = {
    userName,
  };

  data.contacts = await User.find(filter, projection).limit(options.limit).skip(options.skip);
  data.totalCount = await User.countDocuments(filter);
  res.send({success: true, data});
});

/**
 * @api {GET} /contact-requests Get User Contact Requests
 * @apiGroup Contacts
 * @apiName GetContactRequests
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/contact-requests', auth, isEmailVerified, async (req, res) => {
  const data = {};

  const user = req.user;
  const query = req.query;
  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };

  const filter = {
    userId: user._id,
  };

  const projection = {transactionDetails: 0};
  data.contactRequests = await ContactRequest.find(filter, projection).limit(options.limit).skip(options.skip);
  data.totalCount = await ContactRequest.estimatedDocumentCount(filter);

  res.send({success: true, data});
});

/**
 * @api {POST} /contact-approve/:id Get User Contact Approve
 * @apiGroup Contacts
 * @apiName GetContactapprove
 * @apiParam {Boolean} approved      Mandatory Approved.
 * @apiHeader {String} token         Mandatory users unique token.
 */

router.post('/contact-approve/:id', auth, isEmailVerified, async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const docId = req.params.id;

  checkRequiredFields(['approved'], payload);

  const data = await ContactRequest.findOneAndDelete({_id: docId, userId: user._id});
  if (data) {
    const transactionDetails = data.transactionDetails;
    if (payload.approved) transactionController.createTransaction(transactionDetails);
  } else throw new Error('No Request Found');
});

module.exports = router;
