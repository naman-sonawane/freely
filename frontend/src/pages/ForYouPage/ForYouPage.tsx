import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppNavbar from '../App Navbar/AppNavbar';
import MediaCard from './components/MediaCard';
import LoadingSpinner from './components/LoadingSpinner';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  mediaUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  mediaType: string;
  datePublished: string;
  estimatedReadTime: string;
  relevanceScore: number;
  matchedInterests: string[];
}

interface NewsResponse {
  total: number;
  offset: number;
  limit: number;
  items: NewsItem[];
}

const ForYouPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const [savedItems, setSavedItems] = useState<{ [key: string]: boolean }>({});
  const [categories, setCategories] = useState<string[]>(['business', 'finance', 'stocks']);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchUserGoals = async (username: string) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/users/profile', {
        params: { username }
      });
      return response.data.goals;
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return [];
    }
  };

  const fetchNews = async (goalsToUse: string[], page: number = 0) => {
    setLoading(true);
    try {
      const interests = goalsToUse.join(',');
      const categoriesStr = categories.join(',');
      const offset = page * limit;
      
      const response = await axios.get<NewsResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/news/personalized`, {
          params: {
            interests,
            categories: categoriesStr,
            limit,
            offset
          }
        }
      );
      
      if (page === 0) {
        setNewsItems(response.data.items);
      } else {
        setNewsItems(prev => [...prev, ...response.data.items]);
      }
      
      // Check if there are more items to load
      setHasMore(response.data.items.length === limit);
      
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(selectedGoals.length > 0 ? selectedGoals : goals, nextPage);
    }
  };

  useEffect(() => {
    const fetchGoalsAndNews = async () => {
      const username = Cookies.get('username');

      if (!username) {
        console.error('Username not found in cookies');
        return;
      }

      const userGoals = await fetchUserGoals(username);
      setGoals(userGoals);

      // Reset page when goals change
      setPage(0);
      await fetchNews(selectedGoals.length > 0 ? selectedGoals : userGoals);
    };

    fetchGoalsAndNews();
  }, [selectedGoals, categories]);

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };

  const handleCategoryToggle = (category: string) => {
    setCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleLike = (id: string) => {
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = (id: string) => {
    setSavedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Update the categories object with the new options
  const categoryOptions = {
    business: 'Business',
    finance: 'Finance',
    stocks: 'Stocks',
    crypto: 'Cryptocurrency',
    realestate: 'Real Estate',
    commodities: 'Commodities',
    technology: 'Technology',
    general: 'General News',
    science: 'Science',
    education: 'Education'
  };

  return (
    <div className="min-h-screen bg-gray-100 w-[100vw]">
      <AppNavbar />
      
      <div className="w-full max-w-screen-xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar - Filters */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
            
            {/* Goals Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your Goals</h3>
              <div className="flex flex-col gap-2">
                {goals.map((goal, index) => (
                  <button
                    key={index}
                    onClick={() => handleGoalToggle(goal)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors text-left ${
                      selectedGoals.includes(goal)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Categories Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="flex flex-col gap-2">
                {Object.entries(categoryOptions).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryToggle(key)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors text-left ${
                      categories.includes(key)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content - News Feed */}
        <div className="flex-grow max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">For You</h1>
          
          {/* News Feed */}
          <div className="space-y-4">
            {newsItems.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.mediaUrl || ''}
                sourceUrl={item.sourceUrl}
                sourceName={item.sourceName}
                type={item.mediaType}
                readTime={item.estimatedReadTime}
                date={new Date(item.datePublished).toLocaleDateString()}
                relevanceScore={item.relevanceScore}
                matchedGoals={item.matchedInterests}
                isLiked={likedItems[item.id] || false}
                isSaved={savedItems[item.id] || false}
                onLike={() => handleLike(item.id)}
                onSave={() => handleSave(item.id)}
              />
            ))}
            
            {/* Loading State */}
            {loading && newsItems.length === 0 && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            )}
            
            {/* Empty State */}
            {!loading && newsItems.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500 mb-4">
                  Try selecting different goals or categories to see more content.
                </p>
              </div>
            )}
            
            {/* Load More Button */}
            {newsItems.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading || !hasMore}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    loading || !hasMore
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Articles'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Trending */}
        <div className="md:w-80 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Trending Topics</h2>
            <ul className="space-y-3">
              {['AI & Machine Learning', 'Web Development', 'Data Science', 'Career Growth', 'Productivity'].map((topic, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{topic}</p>
                    <p className="text-xs text-gray-500">{Math.floor(Math.random() * 100) + 10} articles</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYouPage;
