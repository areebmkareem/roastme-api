const express = require('express');
const router = new express.Router();
const fs = require('fs');
const Invoice = require('../../models/invoice');
const ContactRequest = require('../../models/contactRequest');
const auth = require('../../controllers/auth');
const generatePdf = require('../../controllers/pdfGenerator');

const checkRequiredFields = require('../../helper/checkRequiredFields');

const isEmailVerified = require('../../controllers/emailVerified');

const defaultLimit = 10;
const defaultSkip = 0;

/**
 * @api {POST} /invoice Create Bill
 * @apiGroup Bills
 * @apiName createBill
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.post('/invoice', auth, isEmailVerified, async (req, res) => {
  const data = req.body;
  let filePath = await generatePdf(data); //   const data = {};
  let invoice = new Invoice(data);
  await invoice.save();
  res.download(filePath, () => {
    fs.unlinkSync(filePath, () => {});
  });
});

module.exports = router;
