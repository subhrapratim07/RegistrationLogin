// models/BookTable.js
const pool = require('../db');

module.exports = {
  async create({ name, email, date, time, guests }) {
    const result = await pool.query(
      'INSERT INTO book_tables(name, email, date, time, guests) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [name, email, date, time, guests]
    );
    return result.rows[0];
  }
};
