import React from 'react';

interface ArticleCardProps {
  title: string;
  summary?: string;
  category?: string;
  createdDate?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, summary, category, createdDate }) => {
  return (
    <div 
      className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
      style={{ minHeight: '200px' }}
    >
      <h2 className="text-xl font-bold text-black mb-2">{title}</h2>

      {category && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Category:</span> {category}
        </p>
      )}

      {createdDate && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Created:</span> {createdDate}
        </p>
      )}

      {summary && (
        <p className="text-gray-700 mt-2 text-sm line-clamp-3">
          {summary}
        </p>
      )}
    </div>
  );
};

export default ArticleCard;
