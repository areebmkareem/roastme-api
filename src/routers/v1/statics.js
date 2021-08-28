const express = require('express');
const router = new express.Router();
const Invoice = require('../../models/invoice');
const auth = require('../../controllers/auth');

const isEmailVerified = require('../../controllers/emailVerified');

/**
 * @api {GET} /statics Get Statics
 * @apiGroup Statics
 * @apiName getStatics
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.get('/statics', auth, isEmailVerified, async (req, res) => {
  const user = req.user;
  const aggregateOptions = [
    {$match: {userId: user._id}},
    {
      $group: {
        _id: '$userId',
        totalHours: {$sum: '$totalHours'},
        totalCreditedToAccount: {$sum: '$creditedToAccount'},
        totalCommission: {$sum: '$commissionInInr'},
        totalTax: {$sum: '$tax'},
      },
    },
  ];
  let payload = await Invoice.aggregate(aggregateOptions);
  res.send({success: true, data: payload[0]});
});

module.exports = router;
