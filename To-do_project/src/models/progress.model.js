// models/progress.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // your DB config

const Progress = sequelize.define('Progress', {
  progress_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  progress_percentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'progress',
  timestamps: false,
});

module.exports = Progress;