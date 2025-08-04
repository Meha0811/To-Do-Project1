const db = require('../db/db-connection');

// Create a new reminder
exports.createReminder = async (reminder) => {
  const sql = `INSERT INTO reminder (task_id, reminder_time, is_sent) VALUES (?, ?, false)`;
  const result = await db(sql, [reminder.task_id, reminder.reminder_time]);
  return result;
};

// Get all reminders
exports.getAllReminders = async () => {
  const sql = `SELECT * FROM reminder`;
  const result = await db(sql);
  return result;
};

// Get reminders by task_id
exports.getRemindersByTaskId = async (task_id) => {
  const sql = `SELECT * FROM reminder WHERE task_id = ?`;
  const result = await db(sql, [task_id]);
  return result;
};

// Delete a reminder
exports.deleteReminder = async (reminder_id) => {
  const sql = `DELETE FROM reminder WHERE reminder_id = ?`;
  const result = await db(sql, [reminder_id]);
  return result;
};
