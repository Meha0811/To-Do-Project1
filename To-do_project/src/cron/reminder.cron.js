const cron = require('node-cron');
const db = require('./db/db-connection');
const sendEmail = require('./utils/email.utils');

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const sql = `
      SELECT r.reminder_id, r.reminder_time, r.is_sent, t.title, u.email
      FROM reminder r
      JOIN task t ON r.task_id = t.task_id
      JOIN user u ON t.user_id = u.user_id
      WHERE r.is_sent = FALSE AND r.reminder_time <= ?
    `;
    const reminders = await db(sql, [now]);

    for (const reminder of reminders) {
      const message = `Reminder: Task "${reminder.title}" is due soon!`;
      await sendEmail(reminder.email, 'Task Reminder', message);

      // Mark reminder as sent
      await db('UPDATE reminder SET is_sent = TRUE WHERE reminder_id = ?', [reminder.reminder_id]);
    }
  } catch (err) {
    console.error('❌ Error in reminder cron:', err);
  }
});
