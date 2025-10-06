const express = require('express');
const router = express.Router();
const bookTableController = require('../controllers/bookTableController');

// POST /book-table
router.post('/book-table', bookTableController.createBooking);

module.exports = router;
