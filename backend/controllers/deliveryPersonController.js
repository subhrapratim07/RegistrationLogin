const pool = require('../db');

// Add new delivery person
const addDeliveryPerson = async (req, res) => {
  const { DeliveryPerson_ID, Name, Phone, Gender, Vehicle_No, AreaCode } = req.body;

  if (!DeliveryPerson_ID || !Name || !Phone || !Gender || !Vehicle_No || !AreaCode) {
    return res.status(400).json({ message: 'Please fill all the required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO delivery_persons ("DeliveryPerson_ID", "Name", "Phone", "Gender", "Vehicle_No", "AreaCode")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [DeliveryPerson_ID, Name, Phone, Gender, Vehicle_No, AreaCode]
    );

    res.status(201).json({ message: 'Delivery person added successfully', person: result.rows[0] });
  } catch (err) {
    console.error('Error adding delivery person:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all delivery persons
const getAllDeliveryPersons = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM delivery_persons ORDER BY "Name"');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching delivery persons:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addDeliveryPerson,
  getAllDeliveryPersons
};
