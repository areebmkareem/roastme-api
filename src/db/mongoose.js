const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('✅ DB Connected.');
  })
  .catch((error) => console.log('🚨' + error));
module.exports = mongoose;
