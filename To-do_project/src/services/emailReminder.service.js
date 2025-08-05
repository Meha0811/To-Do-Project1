const nodemailer = require('nodemailer');
const db = require('../db/db-connection');
const cron = require('node-cron');
const dayjs = require('dayjs');

// 1. Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS  // your App Password
  }
});

// 2. Define a function to check and send reminders
const sendReminders = async () => {
  try {
    // Get all unsent reminders where reminder_time <= now
    const reminderSql = `
      SELECT r.reminder_id, r.task_id, r.reminder_time, u.email, t.title, t.description, t.due_date
      FROM reminder r
      JOIN task t ON r.task_id = t.task_id
      JOIN user u ON t.user_id = u.user_id
      WHERE r.is_sent = false AND r.reminder_time <= NOW();
    `;

    const reminders = await db(reminderSql);

    for (const reminder of reminders) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: `Reminder: Task "${reminder.title}" is due soon!`,
        text: `Hi! Just reminding you:

Task: ${reminder.title}
Description: ${reminder.description}
Due Date: ${dayjs(reminder.due_date).format('YYYY-MM-DD HH:mm')}

Stay productive!`
      };

      await transporter.sendMail(mailOptions);

      // Update reminder as sent
      await db(`UPDATE reminder SET is_sent = true WHERE reminder_id = ?`, [reminder.reminder_id]);

      console.log(`✅ Email sent for task: ${reminder.title}`);
    }
  } catch (error) {
    console.error('❌ Error sending reminders:', error);
  }
};

// 3. Schedule job to run every 1 minute
cron.schedule('* * * * *', sendReminders);

module.exports = sendReminders;