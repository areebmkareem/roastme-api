const Transaction = require('../models/transaction');

const createTransaction = async (payload) => {
  const transaction = new Transaction(payload);
  const data = await transaction.save();
  return data;
};

module.exports = {
  createTransaction,
};
