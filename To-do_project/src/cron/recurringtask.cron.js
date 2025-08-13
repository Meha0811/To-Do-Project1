const cron = require('node-cron');
const db = require('../db/db-connection');
const RecurringTask = require('../models/recurringtask.model');
const Progress = require('../models/progress.model');

// Run every day at 00:05 AM
cron.schedule('5 0 * * *', async () => {
  try {
    console.log('🕒 Generating recurring task occurrences...');

    // 1. Fetch all recurring tasks
    const recurringTasks = await db('SELECT * FROM recurring_task');

    for (const task of recurringTasks) {
      const { recurring_id, task_id, pattern, next_occurence } = task;

      // Determine upcoming dates (next 7 days)
      let currentDate = new Date(next_occurence);
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 7); // next 7 days

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

        // 2. Check if this date is an exception
        const exceptions = await RecurringTask.getExceptions(recurring_id);
        const isExcluded = exceptions.some(e => e.exception_date.toISOString().split('T')[0] === dateStr);
        if (!isExcluded) {
          // 3. Insert into progress if not exists
          await Progress.upsert({ task_id, recurring_instance_date: dateStr, progress_percentage: 0 });
        }

        // 4. Move to next occurrence
        if (pattern === 'Daily') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (pattern === 'Weekly') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (pattern === 'Monthly') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      // 5. Update next_occurence in recurring_task table
      const nextDate = new Date(currentDate);
      await db('UPDATE recurring_task SET next_occurence = ? WHERE recurring_id = ?', [nextDate, recurring_id]);
    }

    console.log('✅ Recurring task occurrences generated successfully.');
  } catch (err) {
    console.error('❌ Error generating recurring task occurrences:', err.message);
  }
});
