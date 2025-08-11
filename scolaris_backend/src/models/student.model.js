import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Student = sequelize.define("Student", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.ENUM("M", "F"), allowNull: false },
  birthDate: { type: DataTypes.DATEONLY, allowNull: false },
  guardian: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  classId: { type: DataTypes.INTEGER, allowNull: false },
  enrollmentDate: { type: DataTypes.DATEONLY, allowNull: false },
  enrollmentStatus: { type: DataTypes.ENUM("active", "pending", "suspended", "graduated"), allowNull: false }
});

export default Student;