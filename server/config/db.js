require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '08021337',
  database: process.env.DB_NAME || 'ElectroHub',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
