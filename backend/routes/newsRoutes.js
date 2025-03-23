const express = require('express');
const { getPersonalizedNews, getNewsByCategory } = require('../controllers/newsController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const router = express.Router();

// Apply cache middleware to news endpoints
router.get('/personalized', cacheMiddleware, getPersonalizedNews);
router.get('/category/:category', cacheMiddleware, getNewsByCategory);

module.exports = router;