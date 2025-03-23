const { fetchNewsByCategory } = require('./rssFeedService');
const NodeCache = require('node-cache');
const newsCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Prefetch news for all major categories
async function prefetchNews() {
  console.log('Prefetching news for all categories...');
  const categories = ['technology', 'science', 'business', 'education', 'general'];
  
  try {
    for (const category of categories) {
      const news = await fetchNewsByCategory(category);
      newsCache.set(`category_${category}`, news);
      console.log(`Prefetched ${news.length} articles for ${category}`);
    }
    console.log('News prefetching complete');
  } catch (error) {
    console.error('Error prefetching news:', error);
  }
}

// Get prefetched news
function getPrefetchedNews(category) {
  return newsCache.get(`category_${category}`);
}

// Schedule prefetching every hour
function scheduleNewsPrefetching() {
  // Initial prefetch
  prefetchNews();
  
  // Schedule hourly prefetch
  setInterval(prefetchNews, 60 * 60 * 1000);
}

module.exports = {
  prefetchNews,
  getPrefetchedNews,
  scheduleNewsPrefetching
}; 