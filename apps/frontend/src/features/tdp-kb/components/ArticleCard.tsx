// ArticleCard.tsx
import React, { useState } from 'react';
import { articleProps } from './dummy';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2 } from 'lucide-react'; // if you're using Lucide icons

export const ArticleCard: React.FC<articleProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    title,
    category,
    subtitle,
    information,
    handle,
    createdDate,
    id
  } = props;

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow w-full h-[300px] overflow-hidden cursor-pointer relative flex flex-col" // Added flex flex-col
      >
        <div className="flex-grow overflow-hidden">
          <p className="text-sm text-gray-600 mb-1 truncate">
            <span className="font-semibold">Category:</span> {category}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {subtitle && (
            <p className="text-sm text-gray-600 mb-1 truncate">
              <span className="font-semibold">Subtitle:</span> {subtitle}
            </p>
          )}

          <p className="text-gray-700 mt-2 text-sm line-clamp-3">
            <span className="font-semibold">Description:</span> {information}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Created Date: {new Date(createdDate || Date.now()).toLocaleDateString()}
          </p>

          {/* Like, Comment, Share buttons */}
          <div className="flex justify-start gap-6 mt-4 text-sm text-blue-600">
            <button className="flex items-center gap-1 hover:text-red-500">
              <Heart size={16} /> Like (0)
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500">
              <MessageCircle size={16} /> Comment
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent p-2 text-center font-bold"
          style={{ color: 'rgb(55, 50, 146)' }}
        >
          <Link
            to={`/knowledge-base/${handle}`}
            className="text-blue-600 hover:text-blue-700"
          >
            Click to see more...
          </Link>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full"> {/* Adjusted bg color */}
                {category}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            {subtitle && <p className="text-lg text-gray-600 mb-4">{subtitle}</p>}
            <p className="text-gray-700 mb-6">{information}</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-100" // Added styling
              >
                Close
              </button>
              <Link
                to={`/knowledge-base/${handle}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Full Article
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
