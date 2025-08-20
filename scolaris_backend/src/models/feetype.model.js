import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const FeeType = sequelize.define("FeeTypes", {
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true }
});

export default FeeType;