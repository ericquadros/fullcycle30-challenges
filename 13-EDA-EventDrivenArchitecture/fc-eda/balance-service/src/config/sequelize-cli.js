require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'balance_db',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  },
  test: {
    username: process.env.TEST_DB_USER || 'user',
    password: process.env.TEST_DB_PASSWORD || 'password',
    database: process.env.TEST_DB_NAME || 'balance_db_test',
    host: process.env.TEST_DB_HOST || 'postgres',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.TEST_DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  },
  production: {
    username: process.env.PROD_DB_USER || 'user',
    password: process.env.PROD_DB_PASSWORD || 'password',
    database: process.env.PROD_DB_NAME || 'balance_db',
    host: process.env.PROD_DB_HOST || 'postgres',
    port: parseInt(process.env.PROD_DB_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.PROD_DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
}; 