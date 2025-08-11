import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Classe = sequelize.define("Classe", {
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false }
});

export default Classe;