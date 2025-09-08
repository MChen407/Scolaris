import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Teacher = sequelize.define("Teacher", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  specialization: { type: DataTypes.STRING, allowNull: true },
  niveau: { 
    type: DataTypes.ENUM('Primaire', 'Secondaire'), 
    allowNull: false,
    defaultValue: 'Primaire'
  },
  weeklyHours: { type: DataTypes.INTEGER, allowNull: true },
  hireDate: { type: DataTypes.DATEONLY, allowNull: false }
});

export default Teacher;

