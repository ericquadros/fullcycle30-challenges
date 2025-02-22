import { Sequelize } from "sequelize-typescript";
import ProductModel from "../infrastructure/product/repository/sequelize/product.model";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql", // ou o banco de dados que você está usando
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialectOptions: {
    charset: 'utf8mb4',
  },
  models: [ProductModel], // Registre seus modelos aqui
});

export default sequelize; 