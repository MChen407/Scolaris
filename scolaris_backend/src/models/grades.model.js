import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Grade = sequelize.define("Grade", {
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  subjectId: { type: DataTypes.INTEGER, allowNull: false },
  classId: { type: DataTypes.INTEGER, allowNull: false },
  period: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.FLOAT, allowNull: false },
  maxGrade: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  type: { type: DataTypes.ENUM("Devoir", "Interro"), allowNull: false }
});

export default Grade;