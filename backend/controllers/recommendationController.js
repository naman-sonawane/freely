const { fetchNewsByCategory, fetchAllNews, matchNewsToInterests } = require('../services/rssFeedService');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/userModel');

// Initialize Gemini API with the correct environment variable name
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Available categories from our RSS feeds
const AVAILABLE_CATEGORIES = [
  'technology', 'science', 'business', 'finance', 'stocks', 
  'crypto', 'realestate', 'commodities', 'education', 'general'
];

/**
 * Get personalized recommendations based on user's interests, goals, and assets
 */
exports.getRecommendedContent = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ 
        error: 'Please provide a username for personalized recommendations' 
      });
    }
    
    // Fetch the user's complete profile from the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { interests, goals, assets } = user;
    
    // Format asset information for the AI
    const assetInfo = assets.map(asset => {
      return `${asset.name} (${asset.type}): $${asset.value}`;
    }).join('\n');
    
    // Calculate asset distribution by type
    const assetDistribution = {};
    let totalValue = 0;
    
    assets.forEach(asset => {
      if (!assetDistribution[asset.type]) {
        assetDistribution[asset.type] = 0;
      }
      assetDistribution[asset.type] += asset.value;
      totalValue += asset.value;
    });
    
    // Format asset distribution for the AI
    const distributionInfo = Object.entries(assetDistribution)
      .map(([type, value]) => {
        const percentage = totalValue > 0 ? ((value) / totalValue * 100).toFixed(2) : 0;
        return `${type}: ${percentage}%`;
      })
      .join('\n');
    
    // Combine all user profile information
    const userProfile = `
      Interests: ${interests.join(', ') || 'None specified'}
      Goals: ${goals.join(', ') || 'None specified'}
      
      Asset Portfolio:
      ${assets.length > 0 ? assetInfo : 'No assets'}
      
      Portfolio Distribution:
      ${assets.length > 0 ? distributionInfo : 'No assets'}
    `;
    
    // Use Gemini to analyze which categories would be most relevant
    const prompt = `
      You are a financial news recommendation system. Based on the following user profile, determine which news categories would be most relevant to their interests, goals, and investment portfolio.
      
      User Profile:
      ${userProfile}
      
      Available categories: ${AVAILABLE_CATEGORIES.join(', ')}
      
      Consider the following when making recommendations:
      1. If they have stocks, recommend finance and stocks categories
      2. If they have crypto assets, recommend crypto category
      3. If they have real estate investments, recommend realestate category
      4. Always include business category for investors
      5. Include technology if it's in their interests or they have tech stocks
      6. Include any categories that align with their stated interests and goals
      
      Return your response as a JSON array of strings containing ONLY the most relevant category names from the available list.
      For example: ["technology", "science", "education"]
      
      Include at least 2 and at most 5 categories. Do not include any explanation, just the JSON array.
    `;
    
    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    
    // Parse the JSON response from Gemini
    let recommendedCategories;
    try {
      // Extract JSON array if it's wrapped in backticks
      const jsonMatch = textResult.match(/\[(.*)\]/s);
      const jsonString = jsonMatch ? `[${jsonMatch[1]}]` : textResult;
      recommendedCategories = JSON.parse(jsonString);
      
      // Validate that we got valid categories
      recommendedCategories = recommendedCategories.filter(
        category => AVAILABLE_CATEGORIES.includes(category)
      );
      
      // If we somehow got no valid categories, default to some safe ones
      if (recommendedCategories.length === 0) {
        recommendedCategories = ['business', 'finance', 'general'];
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Default to safe categories if parsing fails
      recommendedCategories = ['business', 'finance', 'general'];
    }
    
    // Now fetch news from the recommended categories
    const categoryResults = await Promise.all(
      recommendedCategories.map(category => fetchNewsByCategory(category))
    );
    let newsItems = categoryResults.flat();
    
    // Remove duplicates
    const uniqueNews = removeDuplicates(newsItems, 'title');
    
    // Create a combined list of interests, goals, and asset names for matching
    const interestsList = interests || [];
    const goalsList = goals || [];
    const assetNames = assets.map(asset => asset.name) || [];
    const assetTypes = assets.map(asset => asset.type) || [];
    
    const userKeywords = [
      ...interestsList, 
      ...goalsList, 
      ...assetNames,
      ...assetTypes
    ];
    
    // Match and rank by user interests, goals, and assets
    const matchedNews = matchNewsToInterests(uniqueNews, userKeywords);
    
    // Additional ranking for assets - boost articles that mention user's assets
    const boostedNews = matchedNews.map(article => {
      let assetBoost = 0;
      
      // Check if article mentions any of the user's assets
      assets.forEach(asset => {
        const assetName = asset.name.toLowerCase();
        const assetType = asset.type.toLowerCase();
        
        if (
          article.title.toLowerCase().includes(assetName) || 
          article.description.toLowerCase().includes(assetName) ||
          article.title.toLowerCase().includes(assetType) || 
          article.description.toLowerCase().includes(assetType)
        ) {
          // Boost based on the asset's value relative to portfolio
          const assetPercentage = asset.value / totalValue;
          assetBoost += assetPercentage * 2; // Multiply by 2 to give it more weight
        }
      });
      
      return {
        ...article,
        relevanceScore: article.relevanceScore + assetBoost
      };
    });
    
    // Sort by relevance and date
    const sortedNews = boostedNews.sort((a, b) => {
      // First by relevance score (high to low)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Then by date (newest first)
      return new Date(b.datePublished) - new Date(a.datePublished);
    });
    
    // Paginate results
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const paginatedNews = sortedNews.slice(offset, offset + limit);
    
    res.json({
      total: sortedNews.length,
      offset: offset,
      limit: limit,
      recommendedCategories: recommendedCategories,
      items: paginatedNews
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

// Helper function to remove duplicates
function removeDuplicates(array, key) {
  return [...new Map(array.map(item => [item[key], item])).values()];
} 