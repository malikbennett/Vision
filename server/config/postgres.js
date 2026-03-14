// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT) || 5432,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
