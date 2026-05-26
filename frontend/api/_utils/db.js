const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-eu-west-1.pooler.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres.veiyxdruesilstxuupeh',
  password: process.env.SUPABASE_DB_PASSWORD || '',
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 10000,
});

module.exports = { pool };
