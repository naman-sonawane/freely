const axios = require('axios');

async function getLinkPreview(url) {
    try {
        const response = await axios.get('https://api.linkpreview.net', {
            params: {
                key: process.env.LINK_PREVIEW_API_KEY,
                q: url
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching link preview:', error);
        throw new Error('Failed to fetch link preview');
    }
}

module.exports = { getLinkPreview };
