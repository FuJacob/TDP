import { useState } from 'react';
import { dummyArticles } from '../components/dummy';

const BmMain = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Knowledge Base Module</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyArticles && dummyArticles.length > 0 ? (
          dummyArticles.map((article) => (
            <div key={article.id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>

              <p className="text-sm text-gray-500 mb-2">{article.subtitle}</p>

              <span className="text-xs text-blue-600 font-bold">{article.category}</span>

              {/* Rendering full HTML content of the 'infomation' */}
              <div
                className="text-sm mt-2 text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: article.infomation,
                }}
              />

              <a href={`/knowledge-base/${article.handle}`} className="text-blue-500 mt-4 block">Read More</a>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-gray-500">No articles available at the moment.</p>
        )}
      </div>
    </>
  );
};

export default BmMain;
