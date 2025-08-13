const db = require('../db/db-connection');

const Progress = {};

// Create or update progress for task or recurring instance
Progress.upsert = async ({ task_id, recurring_instance_date, progress_percentage }) => {
  const selectSql = `
    SELECT * FROM progress
    WHERE task_id = ? AND recurring_instance_date ${recurring_instance_date ? '= ?' : 'IS NULL'}
  `;
  const values = [task_id];
  if (recurring_instance_date) values.push(recurring_instance_date);

  const rows = await db(selectSql, values);
  if (rows.length > 0) {
    const updateSql = `
      UPDATE progress
      SET progress_percentage = ?, updated_at = NOW()
      WHERE task_id = ? AND recurring_instance_date ${recurring_instance_date ? '= ?' : 'IS NULL'}
    `;
    const updateValues = [progress_percentage, task_id];
    if (recurring_instance_date) updateValues.push(recurring_instance_date);
    await db(updateSql, updateValues);
    return { message: 'Progress updated' };
  } else {
    const insertSql = `
      INSERT INTO progress (task_id, recurring_instance_date, progress_percentage)
      VALUES (?, ?, ?)
    `;
    await db(insertSql, [task_id, recurring_instance_date || null, progress_percentage]);
    return { message: 'Progress created' };
  }
};

// Get progress for task or recurring instance
Progress.getByTask = async (task_id, recurring_instance_date) => {
  const sql = `
    SELECT * FROM progress
    WHERE task_id = ? AND recurring_instance_date ${recurring_instance_date ? '= ?' : 'IS NULL'}
  `;
  const values = [task_id];
  if (recurring_instance_date) values.push(recurring_instance_date);
  const rows = await db(sql, values);
  return rows;
};

// Reset progress
Progress.reset = async (task_id, recurring_instance_date) => {
  const sql = `
    UPDATE progress
    SET progress_percentage = 0, updated_at = NOW()
    WHERE task_id = ? AND recurring_instance_date ${recurring_instance_date ? '= ?' : 'IS NULL'}
  `;
  const values = [task_id];
  if (recurring_instance_date) values.push(recurring_instance_date);
  const result = await db(sql, values);
  return result;
};

module.exports = Progress;
