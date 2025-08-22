import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TeacherPayment = sequelize.define("TeacherPayments", {
  teacherId: { type: DataTypes.INTEGER, allowNull: false },
  hours: { type: DataTypes.FLOAT, allowNull: false },
  rate: { type: DataTypes.FLOAT, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  period: { type: DataTypes.ENUM("day", "week", "month"), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false }
});

export default TeacherPayment;