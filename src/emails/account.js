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

module.exports = {
  sendWelcomeEmail,
};
