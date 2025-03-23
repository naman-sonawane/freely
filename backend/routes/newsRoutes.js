const express = require('express');
const { getPersonalizedNews, getNewsByCategory } = require('../controllers/newsController');
const { getRecommendedContent } = require('../controllers/recommendationController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const router = express.Router();

// Apply cache middleware to news endpoints
router.get('/personalized', cacheMiddleware, getPersonalizedNews);
router.get('/category/:category', cacheMiddleware, getNewsByCategory);
router.get('/recommended', cacheMiddleware, getRecommendedContent);

module.exports = router;