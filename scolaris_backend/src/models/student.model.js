import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Student = sequelize.define("Student", {
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.ENUM("M", "F"), allowNull: true },
  birthDate: { type: DataTypes.DATEONLY, allowNull: true },
  guardian: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  classId: { type: DataTypes.INTEGER, allowNull: true },
  enrollmentDate: { type: DataTypes.DATEONLY, allowNull: true },
  enrollmentStatus: { type: DataTypes.ENUM("active", "pending", "suspended", "graduated"), allowNull: true },
    documents: { // Ajout du champ documents
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