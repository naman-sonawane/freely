const { fetchNewsByCategory, fetchAllNews, matchNewsToInterests } = require('../services/rssFeedService');

// Get personalized news based on user interests
exports.getPersonalizedNews = async (req, res) => {
  try {
    const { interests, categories, limit = 20, offset = 0 } = req.query;
    
    let newsItems = [];
    const userInterests = interests ? interests.split(',') : [];
    const requestedCategories = categories ? categories.split(',') : ['general', 'technology'];
    
    // Fetch news from requested categories
    if (requestedCategories.length > 0) {
      const categoryResults = await Promise.all(
        requestedCategories.map(category => fetchNewsByCategory(category))
      );
      newsItems = categoryResults.flat();
    } else {
      // Fetch from all categories if none specified
      newsItems = await fetchAllNews();
    }
    
    // Remove duplicates (sometimes feeds have the same story)
    const uniqueNews = removeDuplicates(newsItems, 'title');
    
    // Match and rank by user interests
    const matchedNews = matchNewsToInterests(uniqueNews, userInterests);
    
    // Sort by relevance and date
    const sortedNews = matchedNews.sort((a, b) => {
      // First by relevance score (high to low)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Then by date (newest first)
      return new Date(b.datePublished) - new Date(a.datePublished);
    });
    
    // Paginate results
    const paginatedNews = sortedNews.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      total: sortedNews.length,
      offset: parseInt(offset),
      limit: parseInt(limit),
      items: paginatedNews
    });
  } catch (error) {
    console.error('Error fetching personalized news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

// Get news by specific category
exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const newsItems = await fetchNewsByCategory(category);
    
    // Sort by date (newest first)
    const sortedNews = newsItems.sort((a, b) => 
      new Date(b.datePublished) - new Date(a.datePublished)
    );
    
    // Paginate results
    const paginatedNews = sortedNews.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      category,
      total: sortedNews.length,
      offset: parseInt(offset),
      limit: parseInt(limit),
      items: paginatedNews
    });
  } catch (error) {
    console.error(`Error fetching news for category ${req.params.category}:`, error);
    res.status(500).json({ error: 'Failed to fetch category news' });
  }
};

// Helper function to remove duplicates
function removeDuplicates(array, key) {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}