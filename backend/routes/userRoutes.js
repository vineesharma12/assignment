const express = require('express');
const { listUsers, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, listUsers);
router.put('/profile', protect, updateProfile);

module.exports = router;
