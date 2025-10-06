const pool = require('../db');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).send("Incorrect password or user not found!");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Incorrect password or user not found!");
    }

    // ✅ Send user info with role
    res.json({
      message: "Success",
      email: user.email,
      role: user.role || "user"
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { loginUser };
