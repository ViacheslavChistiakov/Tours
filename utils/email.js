const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
  // 1) Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Calling for you <slava@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the Email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
