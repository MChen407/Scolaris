import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/config/scolaris.sqlite", 
  logging: false
});

export default sequelize