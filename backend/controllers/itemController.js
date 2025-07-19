//itemController
const pool = require('../db');

const itemController = {
  async createItems(req, res) {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided.' });
    }

    try {
      const insertedItems = [];

      for (const item of items) {
        const { itemId, itemName, description, price, image } = item;

        // Log received item to help debug if needed
        console.log('📦 Incoming item:', item);

        if (!itemId || !itemName || !description || !price) {
          console.warn('⚠️ Missing required fields in item:', item);
          return res.status(400).json({ message: 'Missing required fields in one or more items.' });
        }

        const result = await pool.query(
          `INSERT INTO items (itemid, itemname, description, price, image)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [itemId, itemName, description, price, image || '']
        );

        insertedItems.push(result.rows[0]);
      }

      res.status(201).json({
        message: 'Items added successfully',
        items: insertedItems
      });

    } catch (err) {
      console.error('❌ Error inserting items:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getAllItems(req, res) {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY itemName ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}

};

module.exports = itemController;
