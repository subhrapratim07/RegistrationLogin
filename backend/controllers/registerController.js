const pool = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { name, email, phonenumber, password } = req.body;

  if (!name || !email || !phonenumber || !password) {
    return res.status(400).send("Submit all the fields");
  }

  try {
    const result = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.send("Already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (email, name, phonenumber, password) VALUES ($1, $2, $3, $4)",
      [email, name, phonenumber, hashedPassword]
    );

    res.send("Registered successfully! Please login.");
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { registerUser };
