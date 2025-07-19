// routes/deliveryPersonRoutes.js
const express = require('express');
const router = express.Router();
const {
  addDeliveryPerson,
  getAllDeliveryPersons
} = require('../controllers/deliveryPersonController');

router.post('/', addDeliveryPerson);
router.get('/', getAllDeliveryPersons);

module.exports = router;
