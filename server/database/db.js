// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,       // e.g. "postgres"
    host: process.env.DB_HOST,       // e.g. "db.xxxxx.supabase.co"
    database: process.env.DB_NAME,   // usually "postgres"
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,       // usually 5432
    ssl: { rejectUnauthorized: false } // required for Supabase
});

module.exports = pool;
