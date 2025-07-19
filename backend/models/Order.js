// models/Order.js
const pool = require('../db');

module.exports = {
  async getLastOrderNumber() {
    const result = await pool.query('SELECT "orderNumber" FROM orders ORDER BY "createdAt" DESC LIMIT 1');
    return result.rows[0];
  },

  async create({ orderNumber, orderDate, name, address, pincode, deliveryperson }) {
    const result = await pool.query(
      'INSERT INTO orders("orderNumber", "orderDate", name, address, pincode, deliveryperson) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [orderNumber, orderDate, name, address, pincode, deliveryperson]
    );
    return result.rows[0];
  }
};
