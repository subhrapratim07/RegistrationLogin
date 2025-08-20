const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/next-order-id', orderController.getNextOrderId);
router.post('/place-order', orderController.placeOrder);
router.get('/orders', orderController.getOrdersWithoutDeliveryPerson);
router.put('/orders/:orderid/assign-delivery', orderController.assignDeliveryPerson);

module.exports = router;
