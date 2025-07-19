// models/Item.js
const pool = require('../db');

module.exports = {
  async create(item) {
    const result = await pool.query(
      'INSERT INTO items("itemId", "itemName", description, price, image) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [item.itemId, item.itemName, item.description, item.price, item.image || '']
    );
    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query('SELECT * FROM items WHERE "itemName" = $1', [name]);
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM items');
    return result.rows;
  }
};
