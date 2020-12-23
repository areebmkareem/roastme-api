const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  try {
    await sgMail.send({
      to: email,
      from: 'noreplay@roastme.io',
      subject: 'Thanks for joining in!',
      text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
      html: '<strong>Test Email Template from RoastMe App</strong>',
    });
  } catch (err) {}
};

const sendVerificationEmail = async (email, name, otp) => {
  console.log('email, name, otp: ', email, name, otp);
  try {
    await sgMail.send({
      to: email,
      from: 'noreplay@roastme.io',
      subject: 'Thanks for joining in!',
      text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
      html: `<strong>${otp}</strong>`,
    });
  } catch (err) {
    console.log('err: ', err);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
};
