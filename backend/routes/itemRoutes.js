const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// POST multiple items
router.post('/', itemController.createItems);

// GET all items
router.get('/', itemController.getAllItems);

module.exports = router;
