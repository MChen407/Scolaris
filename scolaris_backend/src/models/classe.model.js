import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Classe = sequelize.define("Classes", {
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING, allowNull: true },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  niveau: { 
    type: DataTypes.ENUM('Primaire', 'Secondaire'), 
    allowNull: false,
    defaultValue: 'Primaire'
  }
});

export default Classe;