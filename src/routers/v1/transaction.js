const express = require('express');
const router = new express.Router();

const Transaction = require('../../models/transaction');
const auth = require('../../controllers/auth');
const checkRequiredFields = require('../../helper/checkRequiredFields');
const isEmailVerified = require('../../controllers/emailVerified');

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
  payload.senderId = String(user._id);

  checkRequiredFields(['amount', 'transactionType', 'receiverId'], payload);

  let transaction = new Transaction({
    ...payload,
  });

  const data = await transaction.save();
  res.send({success: true, data});
});

/**
 * @api {GET} /transaction Get User Transactions
 * @apiGroup Transactions
 * @apiName GetUserTransactions
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/transaction', auth, isEmailVerified, async (req, res) => {
  const user = req.user;
  const query = req.query;
  const projection = {};
  const options = {
    limit: parseInt(query.limit) || defaultLimit,
    skip: parseInt(query.skip) || defaultSkip,
  };
  let data = {};
  data.transactions = await Transaction.find({$or: [{receiverId: user._id}, {senderId: user._id}]}, projection)
    .limit(options.limit)
    .skip(options.skip);

  data = {...data, ...options};
  res.send({success: true, data});
});

module.exports = router;
