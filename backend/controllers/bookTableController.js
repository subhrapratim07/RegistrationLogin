const pool = require('../db');

const bookTableController = {
  async createBooking(req, res) {
    try {
      const { name, email, date, time, guests } = req.body;

      const result = await pool.query(
        'INSERT INTO book_tables(name, email, date, time, guests) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [name, email, date, time, guests]
      );

      res.status(201).json({ message: 'Table booked successfully', data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error booking table' });
    }
  }
};

module.exports = bookTableController;
