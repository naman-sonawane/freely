const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, getProfile } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);

module.exports = router;
