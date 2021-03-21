const express = require('express');
const router = new express.Router();
const fs = require('fs');
const User = require('../../models/user');
const ContactRequest = require('../../models/contactRequest');
const auth = require('../../controllers/auth');
const generatePdf = require('../../controllers/pdfGenerator');

const checkRequiredFields = require('../../helper/checkRequiredFields');

const isEmailVerified = require('../../controllers/emailVerified');

const defaultLimit = 10;
const defaultSkip = 0;

/**
 * @api {POST} /create-bill Create Bill
 * @apiGroup Bills
 * @apiName createBill
 * @apiHeader {String} token  Mandatory users unique token.
 */

router.post('/create-bill', auth, isEmailVerified, async (req, res) => {
  const data = req.body;
  let filePath = await generatePdf(data); //   const data = {};
  res.download(filePath, () => {
    fs.unlinkSync(filePath, () => {});
  });
});

module.exports = router;
