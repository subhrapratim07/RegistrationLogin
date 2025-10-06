const pool = require('../db');

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // ✅ Fetch name, email, phone directly
    const result = await pool.query(
      'SELECT name, email, phonenumber AS phone FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]); // { name, email, phone }
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserByEmail };
