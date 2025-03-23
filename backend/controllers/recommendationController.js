const { fetchNewsByCategory, fetchAllNews, matchNewsToInterests } = require('../services/rssFeedService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with the correct environment variable name
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Available categories from our RSS feeds
const AVAILABLE_CATEGORIES = [
  'technology', 'science', 'business', 'finance', 'stocks', 
  'crypto', 'realestate', 'commodities', 'education', 'general'
];

/**
 * Get personalized recommendations based on user's academic interests and goals
 */
exports.getRecommendedContent = async (req, res) => {
  try {
    const { interests, goals } = req.query;
    
    if (!interests && !goals) {
      return res.status(400).json({ 
        error: 'Please provide at least interests or goals for personalized recommendations' 
      });
    }
    
    // Combine interests and goals for analysis
    const userProfile = `
      Interests: ${interests || 'None specified'}
      Goals: ${goals || 'None specified'}
    `;
    
    // Use Gemini to analyze which categories would be most relevant
    const prompt = `
      Based on the following user profile, determine which news categories would be most relevant.
      
      User Profile:
      ${userProfile}
      
      Available categories: ${AVAILABLE_CATEGORIES.join(', ')}
      
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
        recommendedCategories = ['technology', 'education', 'general'];
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Default to safe categories if parsing fails
      recommendedCategories = ['technology', 'education', 'general'];
    }
    
    // Now fetch news from the recommended categories
    const categoryResults = await Promise.all(
      recommendedCategories.map(category => fetchNewsByCategory(category))
    );
    let newsItems = categoryResults.flat();
    
    // Remove duplicates
    const uniqueNews = removeDuplicates(newsItems, 'title');
    
    // Match and rank by user interests
    const interestsList = interests ? interests.split(',') : [];
    const goalsList = goals ? goals.split(',') : [];
    const userInterests = [...interestsList, ...goalsList];
    
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