import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Grade = sequelize.define('Grades', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'id'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Classes',
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
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Grades',
  timestamps: true
});

export default Grade;