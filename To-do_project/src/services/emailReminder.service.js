const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASSWORD, // your email password or app password
  },
});

// Send reminder email
async function sendReminderEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"To-Do App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    console.log(`✅ Reminder email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
}

module.exports = sendReminderEmail;
