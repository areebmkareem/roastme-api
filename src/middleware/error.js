const handleError = (err, req, res, next) => {
  res.status(500).send({ error: true, message: err.message || err });
};

module.exports = handleError;
