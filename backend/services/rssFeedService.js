const Parser = require('rss-parser');
const { convert } = require('html-to-text');
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

// List of popular RSS feeds by category
const RSS_FEEDS = {
  technology: [
    { url: 'https://feeds.feedburner.com/TechCrunch', name: 'TechCrunch' },
    { url: 'https://www.wired.com/feed/rss', name: 'Wired' },
    { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
    { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'Ars Technica' }
  ],
  science: [
    { url: 'https://www.sciencedaily.com/rss/all.xml', name: 'ScienceDaily' },
    { url: 'https://rss.sciam.com/ScientificAmerican-Global', name: 'Scientific American' },
    { url: 'https://www.livescience.com/feeds/all', name: 'Live Science' }
  ],
  business: [
    { url: 'https://www.forbes.com/business/feed/', name: 'Forbes Business' },
    { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg' },
    { url: 'https://www.entrepreneur.com/latest.rss', name: 'Entrepreneur' }
  ],
  education: [
    { url: 'https://www.edutopia.org/rss.xml', name: 'Edutopia' },
    { url: 'https://www.edsurge.com/feeds/articles', name: 'EdSurge' }
  ],
  general: [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', name: 'New York Times' },
    { url: 'https://feeds.bbci.co.uk/news/rss.xml', name: 'BBC News' },
    { url: 'https://www.reddit.com/r/news/.rss', name: 'Reddit News' }
  ]
};

// Extract image from various RSS formats
function extractImage(item) {
  // Try media:content
  if (item.media && item.media.$ && item.media.$.url) {
    return item.media.$.url;
  }
  
  // Try enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  
  // Try to extract from content
  if (item.content || item.contentEncoded) {
    const content = item.contentEncoded || item.content;
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return null;
}

// Clean HTML content and limit length
function cleanContent(content, maxLength = 500) {
  if (!content) return '';
  
  const text = convert(content, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' }
    ]
  });
  
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Fetch news from a single RSS feed
async function fetchFeed(feedInfo) {
  try {
    console.log(`Fetching RSS feed: ${feedInfo.name}`);
    const feed = await parser.parseURL(feedInfo.url);
    
    return feed.items.map(item => ({
      id: item.guid || item.link,
      title: item.title,
      description: cleanContent(item.contentSnippet || item.description, 200),
      content: cleanContent(item.contentEncoded || item.content),
      mediaUrl: extractImage(item),
      sourceUrl: item.link,
      sourceName: feedInfo.name,
      mediaType: 'article',
      datePublished: item.pubDate || item.isoDate,
      estimatedReadTime: estimateReadTime(item.contentEncoded || item.content || item.description || '')
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedInfo.name}:`, error);
    return []; // Return empty array instead of failing completely
  }
}

// Estimate reading time based on content length
function estimateReadTime(content) {
  if (!content) return '1 min';
  
  // Average reading speed: 200 words per minute
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  
  return `${minutes} min`;
}

// Fetch news from multiple feeds by category
async function fetchNewsByCategory(category) {
  const feeds = RSS_FEEDS[category] || RSS_FEEDS.general;
  const results = await Promise.all(feeds.map(feed => fetchFeed(feed)));
  return results.flat();
}

// Fetch news from all feeds
async function fetchAllNews() {
  const allFeeds = Object.values(RSS_FEEDS).flat();
  const results = await Promise.all(allFeeds.map(feed => fetchFeed(feed)));
  return results.flat();
}

// Match news to user interests
function matchNewsToInterests(newsItems, interests) {
  if (!interests || interests.length === 0) {
    return newsItems.map(item => ({
      ...item,
      relevanceScore: 0.5,
      matchedInterests: []
    }));
  }
  
  return newsItems.map(item => {
    const matchedInterests = [];
    let relevanceScore = 0;
    
    interests.forEach(interest => {
      const interestLower = interest.toLowerCase();
      const titleLower = item.title.toLowerCase();
      const descriptionLower = item.description.toLowerCase();
      const contentLower = item.content.toLowerCase();
      
      if (
        titleLower.includes(interestLower) || 
        descriptionLower.includes(interestLower) || 
        contentLower.includes(interestLower)
      ) {
        matchedInterests.push(interest);
        
        // Higher weight for matches in title
        if (titleLower.includes(interestLower)) {
          relevanceScore += 0.5;
        } else {
          relevanceScore += 0.3;
        }
      }
    });
    
    // Normalize score between 0 and 1
    relevanceScore = Math.min(relevanceScore, 1);
    
    // If no direct matches but in requested category, give base score
    if (relevanceScore === 0) {
      relevanceScore = 0.1;
    }
    
    return {
      ...item,
      relevanceScore,
      matchedInterests
    };
  });
}

module.exports = {
  fetchFeed,
  fetchNewsByCategory,
  fetchAllNews,
  matchNewsToInterests,
  RSS_FEEDS
};