// models/DeliveryPerson.js
const pool = require('../db');

module.exports = {
  async create({ name, phone }) {
    const result = await pool.query(
      'INSERT INTO delivery_persons(name, phone) VALUES($1, $2) RETURNING *',
      [name, phone]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM delivery_persons');
    return result.rows;
  }
};
