import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Payment = sequelize.define("Payment", {
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  feeTypeId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  method: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("completed", "pending", "cancelled"), allowNull: false }
});

export default Payment;