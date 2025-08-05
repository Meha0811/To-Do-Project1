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