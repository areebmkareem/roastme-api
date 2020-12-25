const ContactRequest = require('../models/contactRequest');

const sendContactRequest = async (payload) => {
  const contactRequest = await new ContactRequest(payload);
  const data = await contactRequest.save();
  return data;
};
const findContactRequest = async (senderId, receiverId) => {
  const data = await ContactRequest.findOne({'requestedBy._id': senderId, userId: receiverId});
  return data;
};
module.exports = {
  sendContactRequest,
  findContactRequest,
};
