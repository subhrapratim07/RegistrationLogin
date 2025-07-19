const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

// ✅ Use correct controller methods
router.get('/next-order-id', orderController.getNextOrderId);
router.post('/place-order', orderController.placeOrder);

module.exports = router;
