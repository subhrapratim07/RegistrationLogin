const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.xquycdvpgkaritddpqwp',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Subhra@1234',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL connected successfully!'))
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  });

module.exports = pool;
