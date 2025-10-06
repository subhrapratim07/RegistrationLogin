const pool = require('../db');

const bookTableController = {
  async createBooking(req, res) {
    try {
      const { name, email, date, time, guests, phone } = req.body;

      if (!email) {
        return res.status(401).json({ message: 'Unauthorized. Please login to book a table.' });
      }

      const result = await pool.query(
        `INSERT INTO book_tables(name, email, phone, date, time, guests, "createdAt", "updatedAt")
         VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [name, email, phone, date, time, guests]
      );

      res.status(201).json({
        message: 'Table booked successfully',
        data: result.rows[0]
      });

    } catch (err) {
      console.error('Error creating booking:', err.message);
      res.status(500).json({ message: 'Error booking table' });
    }
  },

  async getBookings(req, res) {
    try {
      const result = await pool.query(
        `SELECT * FROM book_tables ORDER BY "createdAt" DESC`
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  },

  async getBookingById(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM book_tables WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching booking:', err.message);
      res.status(500).json({ message: 'Failed to fetch booking' });
    }
  },

  async deleteBooking(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM book_tables WHERE id = $1 RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
      console.error('Error deleting booking:', err.message);
      res.status(500).json({ message: 'Failed to delete booking' });
    }
  }
};

module.exports = bookTableController;
