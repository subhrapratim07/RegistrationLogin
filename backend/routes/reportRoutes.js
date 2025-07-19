const express = require('express');
const router = express.Router();
const {
  getOrdersByPincode,
  getOrdersByDateRange
} = require('../controllers/reportController');

// /api/reports/orders-by-pincode
router.get('/orders-by-pincode', getOrdersByPincode);

// /api/reports/orders-by-date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/orders-by-date', getOrdersByDateRange);

module.exports = router;
