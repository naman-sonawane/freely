const { getLinkPreview } = require('../services/linkPreviewService');

async function fetchLinkPreview(req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const previewData = await getLinkPreview(url);
        res.json(previewData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch link preview' });
    }
}

module.exports = { fetchLinkPreview };
