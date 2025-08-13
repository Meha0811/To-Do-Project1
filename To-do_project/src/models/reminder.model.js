const db = require('../db/db-connection');

// Create reminder
exports.createReminder = async (reminder) => {
  const sql = `INSERT INTO reminder (task_id, reminder_time) VALUES (?, ?)`;
  return await db(sql, [reminder.task_id, reminder.reminder_time]);
};

// Get reminder by task ID
exports.getReminderByTaskId = async (task_id) => {
  const sql = `SELECT * FROM reminder WHERE task_id = ?`;
  const result = await db(sql, [task_id]);
  return result[0];
};

// Update reminder
exports.updateReminderByTaskId = async (task_id, reminder_time) => {
  const sql = `UPDATE reminder SET reminder_time = ? WHERE task_id = ?`;
  return await db(sql, [reminder_time, task_id]);
};

// Delete reminder
exports.deleteReminderByTaskId = async (task_id) => {
  const sql = `DELETE FROM reminder WHERE task_id = ?`;
  return await db(sql, [task_id]);
};

// Get all upcoming reminders
exports.getAllUpcomingReminders = async () => {
  const sql = `SELECT * FROM reminder WHERE reminder_time > NOW() AND is_sent = 0`;
  return await db(sql);
};
