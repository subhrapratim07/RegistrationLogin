const pool = require('../db');

// Orders grouped by pincode
const getOrdersByPincode = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pincode, COUNT(*)::int AS "orderCount"
      FROM orders
      GROUP BY pincode
      ORDER BY "orderCount" DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders by pincode:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders by pincode' });
  }
};

const getOrdersByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const result = await pool.query(
      `SELECT 
    o.orderid, 
    o.name, 
    o."orderDate",
    o.pincode,
    o.deliveryperson,
    string_agg(i."itemname" || ' (' || i.quantity || ')', ', ') AS items,
    SUM(i.price * i.quantity) AS total_price
FROM orders o
JOIN order_items i ON o.orderid = i.orderid
WHERE o."orderDate" BETWEEN $1 AND $2
GROUP BY o.orderid, o.name, o."orderDate", o.pincode, o.deliveryperson
ORDER BY o.orderid;`,
      
      [startDate, endDate]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders by date:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
 
};

module.exports = { getOrdersByPincode, getOrdersByDateRange };
