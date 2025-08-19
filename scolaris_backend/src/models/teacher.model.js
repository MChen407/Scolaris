import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Teacher = sequelize.define("Teacher", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  weeklyHours: { type: DataTypes.INTEGER, allowNull: false },
  hireDate: { type: DataTypes.DATEONLY, allowNull: false }
});

export default Teacher;