import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: 'postgres';
  dialectOptions: {
    ssl: boolean | {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  logging?: boolean | ((sql: string) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

const config = {
  development: {
    database: process.env.DB_NAME || 'balance_db',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.DB_LOGGING === 'true' ? console.log : false
  },
  test: {
    database: process.env.TEST_DB_NAME || 'balance_db_test',
    username: process.env.TEST_DB_USER || 'user',
    password: process.env.TEST_DB_PASSWORD || 'password',
    host: process.env.TEST_DB_HOST || 'postgres',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    dialect: 'postgres' as const,
    dialectOptions: {
      ssl: process.env.TEST_DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.TEST_DB_LOGGING === 'true' ? console.log : false
  },
  production: {
    database: process.env.PROD_DB_NAME || 'balance_db',
    username: process.env.PROD_DB_USER || 'user',
    password: process.env.PROD_DB_PASSWORD || 'password',
    host: process.env.PROD_DB_HOST || 'postgres',
    port: parseInt(process.env.PROD_DB_PORT || '5432'),
    dialect: 'postgres' as const,
    dialectOptions: {
      ssl: process.env.PROD_DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.PROD_DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: parseInt(process.env.PROD_DB_POOL_MAX || '5'),
      min: parseInt(process.env.PROD_DB_POOL_MIN || '1'),
      acquire: parseInt(process.env.PROD_DB_POOL_ACQUIRE || '30000'),
      idle: parseInt(process.env.PROD_DB_POOL_IDLE || '10000')
    }
  }
} as Config;

export default config; 