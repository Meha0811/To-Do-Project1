const db = require('../db/db-connection');

const Progress = {};

// ✅ Create or Update Progress
Progress.upsert = (data, callback) => {
  const {
    task_id,
    is_recurring,
    recurring_instance_date,
    status,
    notes
  } = data;

  let selectQuery = `
    SELECT * FROM progress
    WHERE task_id = ? AND is_recurring = ?
  `;
  let values = [task_id, is_recurring];

  if (is_recurring) {
    selectQuery += ' AND recurring_instance_date = ?';
    values.push(recurring_instance_date);
  }

  db.query(selectQuery, values, (err, rows) => {
    if (err) return callback(err);

    if (rows.length > 0) {
      // Update existing progress
      const updateQuery = `
        UPDATE progress
        SET status = ?, notes = ?, updated_at = NOW()
        WHERE id = ?
      `;
      db.query(updateQuery, [status, notes, rows[0].id], (err, result) => {
        if (err) return callback(err);
        callback(null, { message: 'Progress updated', id: rows[0].id });
      });
    } else {
      // Insert new progress
      const insertQuery = `
        INSERT INTO progress (task_id, is_recurring, recurring_instance_date, status, notes)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertQuery, [task_id, is_recurring, recurring_instance_date, status, notes], (err, result) => {
        if (err) return callback(err);
        callback(null, { message: 'Progress created', id: result.insertId });
      });
    }
  });
};

// ✅ Get Progress By Task
Progress.getByTask = (task_id, recurring_instance_date)