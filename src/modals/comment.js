const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
  comment: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  authorAlias: {
    type: String,
    require: true,
  },
  roastId: {
    type: String,
    require: true,
  },
});

let Comment = new mongoose.model('comments', commentsSchema);

module.exports = Comment;
