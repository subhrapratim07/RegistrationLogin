// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../controllers/userController');

router.get('/users/:email', getUserByEmail);

module.exports = router;
