const express = require('express');
const router = express.Router();
const deliveryPersonController = require('../controllers/deliveryPersonController');

// Get all delivery persons
router.get('/', deliveryPersonController.getAllDeliveryPersons);

// Add delivery person
router.post('/', deliveryPersonController.addDeliveryPerson);

module.exports = router;
