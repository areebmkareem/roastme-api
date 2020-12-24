const validator = require('validator');

const checkRequiredFields = (requiredKeys, data) => {
  const requiredFields = requiredKeys.filter((key) => {
    const isNotValidated = !data[key] || validator.isEmpty(String(data[key]));
    if (isNotValidated) return key;
  });
  if (requiredFields.length) throw new Error(`Required Fields Missing ${requiredFields}.`);
};

module.exports = checkRequiredFields;
