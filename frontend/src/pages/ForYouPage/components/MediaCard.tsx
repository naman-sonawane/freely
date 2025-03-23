import React from 'react';

interface MediaCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  type: string;
  readTime: string;
  date: string;
  relevanceScore: number;
  matchedGoals: string[];
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  sourceUrl,
  sourceName,
  type,
  readTime,
  date,
  relevanceScore,
  matchedGoals,
  isLiked,
  isSaved,
  onLike,
  onSave
}) => {
  const handleClick = () => {
    window.open(sourceUrl, '_blank');
  };

  // Format relevance score as percentage
  const relevancePercentage = Math.round(relevanceScore * 100);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-shadow hover:shadow-md">
      {/* Card Header - Source Info */}
      <div className="p-4 pb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
            {sourceName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{sourceName}</h4>
            <div className="flex items-center text-xs text-gray-500">
              <span>{date}</span>
              <span className="mx-1">•</span>
              <span>{readTime} read</span>
              {matchedGoals.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-blue-600">{relevancePercentage}% match</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="px-4 cursor-pointer" onClick={handleClick}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>
      </div>
      
      {/* Card Image */}
      {imageUrl && (
        <div className="px-4 mb-3 cursor-pointer" onClick={handleClick}>
          <div className="rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          </div>
        </div>
      )}
      
      {/* Matched Goals */}
      {matchedGoals.length > 0 && (
        <div className="px-4 mb-3">
          <div className="flex flex-wrap gap-1">
            {matchedGoals.slice(0, 3).map((goal, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                {goal}
              </span>
            ))}
            {matchedGoals.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                +{matchedGoals.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Card Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isLiked ? 0 : 1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Like
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              isSaved ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isSaved ? 0 : 1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save
          </button>
          
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;