const cron = require('node-cron');
const db = require('../db/db-connection');
const sendEmail = require('../utils/email.utils');

cron.schedule('* * * * *', async () => {
  console.log('🔁 Checking reminders...');

  try {
    const now = new Date();

    // Fetch unsent reminders whose time has passed
    const sql = `
      SELECT r.reminder_id, r.reminder_time, r.is_sent, 
             t.title, u.email 
      FROM reminder r
      JOIN task t ON r.task_id = t.task_id
      JOIN user u ON t.user_id = u.user_id
      WHERE r.is_sent = FALSE AND r.reminder_time <= ?
    `;

    const reminders = await db(sql, [now]);

    for (const reminder of reminders) {
      const subject = `Reminder: ${reminder.title}`;
      const body = `⏰ You have an upcoming task: "${reminder.title}"`;

      await sendEmail(reminder.email, subject, body);

      // Mark reminder as sent
      await db('UPDATE reminder SET is_sent = TRUE WHERE reminder_id = ?', [reminder.reminder_id]);
      console.log(`📧 Email sent to ${reminder.email} for task "${reminder.title}"`);
    }

    if (reminders.length === 0) {
      console.log('✅ No due reminders found at this time.');
    }

  } catch (err) {
    console.error('❌ Error while checking reminders:', err);
  }
});
