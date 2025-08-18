// services/emailReminder.service.js
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

async function createTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,             // TLS port
      secure: false,         // use TLS
      auth: {
        user: process.env.EMAIL_USER,  // your Gmail address
        pass: process.env.EMAIL_PASS,  // Gmail app password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
}

async function sendReminderEmail(to, subject, text) {
  try {
    const transport = await createTransporter();

    const info = await transport.sendMail({
      from: `"To-Do App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    console.log(`✅ Reminder email sent to ${to}: ${info.messageId}`);
    return info;

  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    throw err;
  }
}

module.exports = sendReminderEmail;
