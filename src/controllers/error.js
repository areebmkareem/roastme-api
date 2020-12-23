const winston = require('winston');

const handleError = (err, req, res, next) => {
  // winston.log('error', err.message || JSON.stringify(err));
 res.status(500).send({ error: true, message: err.message || err });
  console.log(`⚠️ Error ${err.message || err}`);
};

module.exports = handleError;
