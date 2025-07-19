const pool = require('../db'); // or wherever your PostgreSQL pool is

async function findByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0]; // undefined if no user found
}

async function createUser({ name, email, phonenumber, password }) {
  const result = await pool.query(
    'INSERT INTO users (name, email, phonenumber, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, phonenumber, password]
  );
  return result.rows[0];
}

module.exports = { findByEmail, createUser };
