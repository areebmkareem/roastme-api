const generateOtp = () => {
  let otp = Math.random();
  otp = otp * 10000;
  otp = parseInt(otp);
  return otp;
};

module.exports = generateOtp;
