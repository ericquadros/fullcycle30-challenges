import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'balance_db',
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
