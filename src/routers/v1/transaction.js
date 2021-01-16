const express = require('express');
const router = new express.Router();

const Transaction = require('../../models/transaction');
const auth = require('../../controllers/auth');
const checkRequiredFields = require('../../helper/checkRequiredFields');
const isEmailVerified = require('../../controllers/emailVerified');
const contactController = require('../../controllers/contacts');
const transactionController = require('../../controllers/transaction');

const defaultLimit = 10;
const defaultSkip = 0;

/**
 * @api {POST} /transaction Create A New Transaction
 * @apiGroup Transactions
 * @apiName CreateNewTransaction
 * @apiParam {Number} amount              Mandatory Amount.
 * @apiParam {String} transactionType     Mandatory "lend or borrow".
 * @apiParam {String} receiverId      Mandatory Receiver user id.
 */
router.post('/transaction', auth, isEmailVerified, async (req, res) => {
  let payload = req.body;
  const user = req.user;

  let data;
  payload.senderId = String(user._id);

  checkRequiredFields(['amount', 'transactionType', 'receiverId'], payload);

  const shouldSendRequest = !(user.contacts && user.contacts.includes(payload.receiverId));
  const alreadyArequestOnQueue = await contactController.findContactRequest(payload.senderId, payload.receiverId);

  if (alreadyArequestOnQueue) throw new Error('Your request was considered but was not approved Yet!.');

  if (shouldSendRequest) {
    let requestPayload = {
      requestedBy: {
        userName: user.userName,
        fullName: user.fullName,
        profileImage: user.profileImage,
        _id: user._id,
      },
      userId: payload.receiverId,
      transactionDetails: payload,
    };
    data = await contactController.sendContactRequest(requestPayload);
  } else data = await transactionController.createTransaction(payload);

  res.send({success: true, data});
});

/**
 * @api {GET} /transactions/:id Get User Transactions
 * @apiGroup Transactions
 * @apiName GetUserTransactions
 * @apiHeader {String} token  Mandatory users unique token.
 * @apiHeader {String} id  Mandatory Transaction contact Id.
 */

router.get('/transactions/:id', auth, isEmailVerified, async (req, res) => {
  const data = {};

  const user = req.user;
  const query = req.query;
  const params = req.params;

  const projection = {};
  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };
  const filter = {
    $and: [
      {
        $or: [{receiverId: user._id}, {senderId: user._id}],
      },
      {
        $or: [{receiverId: params.id}, {senderId: params.id}],
      },
    ],
  };

  data.transactions = await Transaction.find(filter, projection).limit(options.limit).skip(options.skip);
  data.totalCount = await Transaction.countDocuments(filter);
  res.send({success: true, data});
});

module.exports = router;
