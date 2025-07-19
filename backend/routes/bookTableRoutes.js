const express = require('express');
const router = express.Router();
const bookTableController = require('../controllers/bookTableController');

router.post('/book-table', bookTableController.createBooking);

module.exports = router;
