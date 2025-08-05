const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendReminderEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,        // Your email
      pass: process.env.EMAIL_APP_PASSWORD // Your app password
    }
  });

  const mailOptions = {
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent to', to);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = sendReminderEmail;
