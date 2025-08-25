import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const FeeType = sequelize.define("FeeTypes", {
  name: { type: DataTypes.STRING, allowNull: false }
});

export default FeeType;