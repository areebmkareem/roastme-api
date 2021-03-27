const express = require('express');
const router = new express.Router();
const fs = require('fs');
const Invoice = require('../../models/invoice');
const ContactRequest = require('../../models/contactRequest');
const auth = require('../../controllers/auth');
const html = require('../../controllers/pdfGenerator');
const dayjs = require('dayjs');
const checkRequiredFields = require('../../helper/checkRequiredFields');

const isEmailVerified = require('../../controllers/emailVerified');
const {sendInvoiceEmail} = require('../../emails/account');

const defaultLimit = 10;
const defaultSkip = 0;

/**
 * @api {POST} /invoice Create Bill
 * @apiGroup Bills
 * @apiName createBill
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.post('/invoice', auth, isEmailVerified, async (req, res) => {
  const user = req.user;
  let data = req.body;
  data.userId = user._id;
  // let filePath = await generatePdf(data); //   const data = {};
  let invoice = new Invoice(data);
  let response = await invoice.save();

  res.send({success: true, data: response});
  // res.download(filePath, () => {
  //   fs.unlinkSync(filePath, () => {});
  // });
});

router.post('/invoice-send', auth, isEmailVerified, async (req, res) => {
  const user = req.user;
  let data = req.body;
  data.month = dayjs(data.billingDate).format('MMM YYYY');
  data.billingDate = dayjs(data.billingDate).format('MMM DD YYYY');
  const generatedHtml = await html.getHtmlTemplate(data);
  await sendInvoiceEmail({mailTo: data.mailTo, html: generatedHtml});
  res.send({success: true, message: 'Email Send!'});
});
router.get('/invoice', auth, isEmailVerified, async (req, res) => {
  const user = req.user;
  const filter = {
    userId: user._id,
  };
  let payload = await Invoice.find(filter);
  let totalCount = await Invoice.countDocuments(filter);
  const data = {
    totalCount,
    payload,
  };
  res.send({success: true, data});
});

module.exports = router;
