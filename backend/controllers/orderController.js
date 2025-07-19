const pool = require('../db');

// Get next order ID
const getNextOrderId = async (req, res) => {
  try {
    const result = await pool.query('SELECT "orderid" FROM orders ORDER BY "createdAt" DESC LIMIT 1');
    let nextOrderId = 'ORD-001';

    if (result.rows.length > 0) {
      const lastNumber = parseInt(result.rows[0].orderid.split('-')[1]);
      const newNumber = String(lastNumber + 1).padStart(3, '0');
      nextOrderId = `ORD-${newNumber}`;
    }

    res.json({ nextOrderId });
  } catch (err) {
    console.error('Error getting next order ID:', err.message);
    res.status(500).json({ error: 'Failed to get next order ID' });
  }
};


// Place new order
const placeOrder = async (req, res) => {
  try {
    const { orderDate, name, address, pincode, items, deliveryperson } = req.body;

    const result = await pool.query('SELECT "orderid" FROM orders ORDER BY "createdAt" DESC LIMIT 1');
    let nextOrderId = 'ORD-001';

    if (result.rows.length > 0) {
      const lastNumber = parseInt(result.rows[0].orderid.split('-')[1]);
      const newNumber = String(lastNumber + 1).padStart(3, '0');
      nextOrderId = `ORD-${newNumber}`;
    }

    // Insert order
    await pool.query(
      `INSERT INTO orders("orderid", "orderDate", name, address, pincode, deliveryperson) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [nextOrderId, orderDate, name, address, pincode, deliveryperson]
    );

    // Insert order items
    for (const item of items) {
      const itemQuery = await pool.query('SELECT price FROM items WHERE "itemname" = $1', [item.item]);
      if (itemQuery.rows.length === 0) {
        return res.status(400).json({ error: `Item '${item.item}' not found.` });
      }

      const price = itemQuery.rows[0].price;

      await pool.query(
        `INSERT INTO order_items(itemname, quantity, price, "orderid") 
         VALUES ($1, $2, $3, $4)`,
        [item.item, item.quantity, price, nextOrderId]
      );
    }

    res.json({ message: 'Order placed successfully!', orderid: nextOrderId });

  } catch (err) {
    console.error('Order placement error:', err.message);
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
};

module.exports = {
  getNextOrderId,
  placeOrder
};
