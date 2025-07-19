// models/OrderItem.js
const pool = require('../db');

module.exports = {
  async create(orderId, item, quantity, price) {
    return await pool.query(
      'INSERT INTO order_items(item, quantity, price, "orderId") VALUES($1, $2, $3, $4)',
      [item, quantity, price, orderId]
    );
  }
};
