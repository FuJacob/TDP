import React from 'react';
import { NavLink } from 'react-router-dom';

export const SubNavMenu: React.FC = () => {
  return (
    <nav className="sub-nav bg-gray-100 border-b border-gray-200 py-2 mb-5">
      <ul className="flex space-x-6 max-w-8xl mx-auto px-6">
        <li>
          <NavLink
            to="/lg/search-tender"
            className={({ isActive }) =>
              `text-lg font-medium py-2 px-4 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`
            }
          >
            Search Tender
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/lg/ai-search-tender"
            className={({ isActive }) =>
              `text-lg font-medium py-2 px-4 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`
            }
          >
            AI Search Tender
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};