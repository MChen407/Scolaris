import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const StudentAverage = sequelize.define('StudentAverages', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false
  },
  generalAverage: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  totalPoints: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  },
  totalCoefficients: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default StudentAverage;