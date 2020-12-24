const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    transactionType: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      required: true,
      type: String,
    },
    closedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  },
);

let Transaction = new mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
