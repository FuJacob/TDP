import { useState } from 'react'
import { dummyArticles } from '../components/dummy'
import { ArticleCard } from '../components/ArticleCard'

const BmMain = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Knowledge Base Module</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyArticles &&
          dummyArticles.length &&
          dummyArticles.map((article) => (
            <ArticleCard 
              key={article.id}
              {...article}
            />
          ))}
      </div>
    </>
  )
}

export default BmMain