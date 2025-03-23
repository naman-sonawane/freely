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
// List of popular RSS feeds by category
const RSS_FEEDS = {
    technology: [
      { url: 'https://feeds.feedburner.com/TechCrunch', name: 'TechCrunch' },
      { url: 'https://www.wired.com/feed/rss', name: 'Wired' },
      { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
      { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'Ars Technica' },
      { url: 'https://www.cnet.com/rss/news/', name: 'CNET' },
      { url: 'https://www.zdnet.com/news/rss.xml', name: 'ZDNet' },
      { url: 'https://thenextweb.com/feed', name: 'The Next Web' },
      { url: 'https://www.engadget.com/rss.xml', name: 'Engadget' },
      { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat' },
      { url: 'https://www.macrumors.com/macrumors.xml', name: 'MacRumors' },
      { url: 'https://www.techmeme.com/feed.xml', name: 'Techmeme' }
    ],
    
    science: [
      { url: 'https://www.livescience.com/feeds/all', name: 'Live Science' },
      { url: 'https://feeds.newscientist.com/feeds/features', name: 'New Scientist' },
      { url: 'https://feeds.nature.com/nature/rss/current', name: 'Nature' },
      { url: 'https://www.science.org/rss/news_current.xml', name: 'Science Magazine' },
      { url: 'https://phys.org/rss-feed/', name: 'Phys.org' },
      { url: 'https://www.popsci.com/feed/', name: 'Popular Science' }
    ],
    
    business: [
      { url: 'https://feeds.bloomberg.com/wealth/news.rss', name: 'Bloomberg Wealth' },
      { url: 'https://www.entrepreneur.com/latest.rss', name: 'Entrepreneur' },
      { url: 'https://www.inc.com/rss/', name: 'Inc. Magazine' },
      { url: 'https://www.fastcompany.com/latest/rss', name: 'Fast Company' },
      { url: 'https://fortune.com/feed/', name: 'Fortune' },
      { url: 'https://www.businessinsider.com/rss', name: 'Business Insider' },
      { url: 'https://feeds.skynews.com/feeds/rss/business.xml', name: 'Sky News Business' },
      { url: 'https://knowledge.wharton.upenn.edu/feed/', name: 'Knowledge@Wharton' },
      { url: 'https://feeds.feedburner.com/CalculatedRisk', name: 'Calculated Risk' }
    ],
    
    finance: [
      { url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', name: 'CNBC Finance' },
      { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', name: 'CNBC Investing' },
      { url: 'https://www.ft.com/rss/home/uk', name: 'Financial Times' },
      { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', name: 'MarketWatch' },
      { url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/', name: 'MarketWatch Pulse' },
      { url: 'https://feeds.marketwatch.com/marketwatch/realtimeheadlines/', name: 'MarketWatch Real-time' },
      { url: 'https://www.wsj.com/xml/rss/3_7031.xml', name: 'WSJ Markets' },
      { url: 'https://www.wsj.com/xml/rss/3_7014.xml', name: 'WSJ Business' },
      { url: 'https://seekingalpha.com/feed.xml', name: 'Seeking Alpha' },
      { url: 'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline', name: 'Investopedia' },
      { url: 'https://www.barrons.com/feed/rss/feed.xml', name: 'Barron\'s' },
      { url: 'https://www.morningstar.com/rss/feed', name: 'Morningstar' },
      { url: 'https://www.economist.com/finance-and-economics/rss.xml', name: 'The Economist Finance' },
      { url: 'https://www.moneycontrol.com/rss/business.xml', name: 'MoneyControl' },
      { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', name: 'Dow Jones Markets' }
    ],
    
    stocks: [
      { url: 'https://www.investors.com/category/market-trend/stock-market-today/feed/', name: 'Investor\'s Business Daily' },
      { url: 'https://www.fool.com/rss/headlines', name: 'Motley Fool' },
      { url: 'https://www.zacks.com/rss/rank_comm.rss', name: 'Zacks Investment Research' },
      { url: 'https://stocknews.com/feed/', name: 'StockNews' },
      { url: 'https://www.benzinga.com/feed/market-news', name: 'Benzinga Markets' },
      { url: 'https://www.marketbeat.com/rss/marketbeat-feed.aspx', name: 'MarketBeat' },
      { url: 'https://www.investmentwatchblog.com/feed/', name: 'Investment Watch Blog' },
      { url: 'https://feeds.finviz.com/finviz_news.rss', name: 'Finviz News' },
      { url: 'https://www.dividendinvestor.com/feed/', name: 'Dividend Investor' },
      { url: 'https://www.tradingview.com/feed/', name: 'TradingView Blog' }
    ],
    
    crypto: [
      { url: 'https://cointelegraph.com/rss', name: 'CoinTelegraph' },
      { url: 'https://coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' },
      { url: 'https://decrypt.co/feed', name: 'Decrypt' },
      { url: 'https://bitcoinmagazine.com/.rss/full/', name: 'Bitcoin Magazine' },
      { url: 'https://cryptobriefing.com/feed/', name: 'Crypto Briefing' },
      { url: 'https://bitcoinist.com/feed/', name: 'Bitcoinist' },
      { url: 'https://ambcrypto.com/feed/', name: 'AMBCrypto' },
      { url: 'https://news.bitcoin.com/feed/', name: 'Bitcoin.com' },
      { url: 'https://cryptopotato.com/feed/', name: 'CryptoPotato' },
      { url: 'https://dailyhodl.com/feed/', name: 'The Daily Hodl' }
    ],
    
    realestate: [
      { url: 'https://www.inman.com/feed/', name: 'Inman' },
      { url: 'https://www.realestateinvestorgoddesses.com/blog/rss.xml', name: 'Real Estate Investor' },
      { url: 'https://www.reit.com/news/rss.xml', name: 'REIT.com' },
      { url: 'https://therealdeal.com/feed/', name: 'The Real Deal' },
      { url: 'https://www.realtor.com/news/feed/', name: 'Realtor.com News' },
      { url: 'https://www.housingwire.com/feed/', name: 'HousingWire' },
      { url: 'https://www.redfin.com/blog/feed/', name: 'Redfin Blog' },
      { url: 'https://www.zillow.com/blog/feed/', name: 'Zillow Blog' },
      { url: 'https://journal.firsttuesday.us/feed/', name: 'first tuesday Journal' },
      { url: 'https://www.biggerpockets.com/blog/feed', name: 'BiggerPockets' }
    ],
    
    commodities: [
      { url: 'https://www.kitco.com/rss/', name: 'Kitco (Precious Metals)' },
      { url: 'https://oilprice.com/rss/main', name: 'OilPrice.com' },
      { url: 'https://www.agriculture.com/rss/news', name: 'Agriculture.com' },
      { url: 'https://feeds.barchart.com/commodities', name: 'Barchart Commodities' },
      { url: 'https://www.mining.com/feed/', name: 'Mining.com' },
      { url: 'https://www.agweb.com/rss', name: 'AgWeb' },
      { url: 'https://www.spglobal.com/platts/en/rss-feed', name: 'S&P Global Platts' },
      { url: 'https://seekingalpha.com/market-news/commodities.xml', name: 'Seeking Alpha Commodities' },
      { url: 'https://www.metalsbulletin.com/rss/', name: 'Metals Bulletin' }
    ],
        
    general: [
      { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', name: 'New York Times' },
      { url: 'https://feeds.bbci.co.uk/news/rss.xml', name: 'BBC News' },
      { url: 'https://www.reddit.com/r/news/.rss', name: 'Reddit News' },
      { url: 'https://www.economist.com/finance-and-economics/rss.xml', name: 'The Economist (Finance)' },
      { url: 'https://feeds.washingtonpost.com/rss/business', name: 'Washington Post Business' },
      { url: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml', name: 'WSJ US Business' },
      { url: 'https://feeds.skynews.com/feeds/rss/home.xml', name: 'Sky News' },
      { url: 'https://www.theguardian.com/uk/rss', name: 'The Guardian' },
      { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' }
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