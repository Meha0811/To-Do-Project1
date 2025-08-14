const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendReminderEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"To-Do App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    });
    console.log(`Reminder email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    throw err;
  }
}

module.exports = sendReminderEmail;
