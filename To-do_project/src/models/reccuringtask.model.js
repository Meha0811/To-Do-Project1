// models/recurringTask.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // your DB config

const RecurringTask = sequelize.define('RecurringTask', {
  recurring_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pattern: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false,
  },
  next_occurence: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'recurring_tasks',
  timestamps: false,
});

module.exports = RecurringTask;