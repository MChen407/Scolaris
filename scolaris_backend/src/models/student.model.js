import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Student = sequelize.define("Students", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.ENUM("M", "F"), allowNull: false },
  birthDate: { type: DataTypes.DATEONLY, allowNull: false },
  guardian: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  parentName: { type: DataTypes.STRING, allowNull: true },
  parentPhone: { type: DataTypes.STRING, allowNull: true },
  classId: { type: DataTypes.INTEGER, allowNull: false },
  enrollmentDate: { type: DataTypes.DATEONLY, allowNull: false },
  enrollmentStatus: { type: DataTypes.ENUM("active", "pending", "suspended", "graduated"), allowNull: false, defaultValue: "active" },
    documents: { 
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      birthCertificate: false,
      medicalCertificate: false,
      photos: false,
      previousSchoolReport: false
    }
  }
});

export default Student;