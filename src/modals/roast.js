const mongoose = require('mongoose');

const roastSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
});

let Roast = new mongoose.model('roasts', roastSchema);

module.exports = Roast;
