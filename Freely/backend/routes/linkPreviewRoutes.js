const express = require('express');
const { fetchLinkPreview } = require('../controllers/linkPreviewController');
const router = express.Router();

router.get('/preview', fetchLinkPreview);

module.exports = router;