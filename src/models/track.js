const mongoose = require('mongoose');

const trackSchema = mongoose.Schema(
  {
    album: {
      type: String,
    },
    artist: {
      type: String,
    },
    cover: {
      type: String,
    },
    duration: {
      type: String,
    },
    title: {
      type: String,
    },
    author: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Roast = new mongoose.model('tracks', trackSchema);

module.exports = Roast;
