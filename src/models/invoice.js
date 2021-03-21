const mongoose = require('mongoose');
const invoiceSchema = mongoose.Schema(
  {},
  {
    timestamps: true,
    strict: false,
  },
);

let Invoice = new mongoose.model('invoice', invoiceSchema);

module.exports = Invoice;
