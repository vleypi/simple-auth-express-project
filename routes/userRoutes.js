const express = require('express');
const router = express.Router();
const { getProfile, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.get('/', authMiddleware, getAllUsers);

module.exports = router;