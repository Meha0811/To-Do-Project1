const cron = require('node-cron');
const db = require('../db/db-connection'); // Your existing db query function
const sendReminderEmail = require('../services/emailReminder.service');
const { decrypt } = require('../utils/encryption.utils');
const UserModel = require('../models/user.model');

// Run every 1 minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // Fetch reminders due now or in past (not sent)
    const sql = `
      SELECT r.reminder_id, r.task_id, r.reminder_time, t.title, t.user_id, t.is_completed
      FROM reminder r
      JOIN task t ON r.task_id = t.task_id
      WHERE r.is_sent = 0 AND r.reminder_time <= ?
    `;
    const reminders = await db(sql, [now]);

    for (const reminder of reminders) {
      // Get user email
      const user = await UserModel.getUserById(reminder.user_id);
      if (!user || !user.email) continue;

      const email = decrypt(user.email);

      // Send email
      await sendReminderEmail(
        email,
        `Reminder: ${reminder.title}`,
        `Hey ${user.name}, don't forget to complete your task: "${reminder.title}"`
      );

      // Mark reminder as sent
      const updateSql = `UPDATE reminder SET is_sent = 1 WHERE reminder_id = ?`;
      await db(updateSql, [reminder.reminder_id]);
    }
  } catch (err) {
    console.error('Error in reminder cron:', err.message);
  }
});
