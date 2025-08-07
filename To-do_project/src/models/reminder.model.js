const db = require('../db/db-connection');

// Create reminder
exports.createReminder = async (reminder) => {
  const sql = `INSERT INTO reminder (task_id, reminder_time) VALUES (?, ?)`;
  const result = await db(sql, [reminder.task_id, reminder.reminder_time]);
  return result;
};

// Get reminder by task ID
exports.getReminderByTaskId = async (task_id) => {
  const sql = `SELECT * FROM reminder WHERE task_id = ?`;
  const result = await db(sql, [task_id]);
  return result[0];
};

// Update reminder for a task
exports.updateReminderByTaskId = async (reminder) => {
  const sql = `UPDATE reminder SET reminder_time = ? WHERE task_id = ?`;
  const result = await db(sql, [reminder.reminder_time, reminder.task_id]);
  return result;
};

// Delete reminder for a task (optional)
exports.deleteReminderByTaskId = async (task_id) => {
  const sql = `DELETE FROM reminder WHERE task_id = ?`;
  const result = await db(sql, [task_id]);
  return result;
};

// Get all upcoming reminders (optional for cron jobs)
exports.getAllUpcomingReminders = async () => {
  const sql = `SELECT * FROM reminder WHERE reminder_time > NOW()`;
  const result = await db(sql);
  return result;
};
