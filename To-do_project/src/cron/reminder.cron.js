const cron = require('node-cron');
const db = require('../db/db-connection');
const sendReminderEmail = require('../services/emailReminder.service');
const { decrypt } = require('../utils/encryption.utils');
const UserModel = require('../models/user.model');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const sql = `
      SELECT r.reminder_id, r.task_id, r.reminder_time, t.title, t.user_id
      FROM reminder r
      JOIN task t ON r.task_id = t.task_id
      WHERE r.is_sent = 0 AND r.reminder_time <= ?
    `;
    const reminders = await db(sql, [now]);

    for (const r of reminders) {
      const user = await UserModel.getUserById(r.user_id);
      if (!user?.email) continue;
      const email = decrypt(user.email);

      await sendReminderEmail(email, `Reminder: ${r.title}`, `Hey ${user.name}, don't forget your task: "${r.title}"`);

      await db('UPDATE reminder SET is_sent = 1 WHERE reminder_id = ?', [r.reminder_id]);
    }
  } catch (err) {
    console.error('Reminder cron error:', err.message);
  }
});
