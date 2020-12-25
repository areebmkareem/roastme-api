const mongoose = require('mongoose');

const contactRequest = mongoose.Schema(
  {
    requestedBy: {
      fullName: String,
      userName: String,
      profileImage: String,
      _id: String,
    },
    userId: String,
    transactionDetails: Object,
  },
  {
    timestamps: true,
  },
);

let ContactRequest = new mongoose.model('contact_request', contactRequest);

module.exports = ContactRequest;
