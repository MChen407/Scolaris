const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  maxGrade: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    defaultValue: 20
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Devoir', 'Interro'),
    allowNull: false
  }
}, {
  tableName: 'grades',
  timestamps: true
});

module.exports = Grade;