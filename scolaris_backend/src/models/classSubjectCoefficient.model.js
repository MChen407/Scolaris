import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const ClassSubjectCoefficient = sequelize.define("ClassSubjectCoefficients", {
  classId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  subjectId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  coefficient: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    defaultValue: 1
  }
});

export default ClassSubjectCoefficient;