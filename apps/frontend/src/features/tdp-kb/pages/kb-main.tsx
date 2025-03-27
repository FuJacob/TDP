import { useState } from 'react'
import { dummyArticles } from '../components/dummy'

const BmMain = () => {
  return (
    <>
      <h1>Knowledge Base Module</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyArticles &&
          dummyArticles.length &&
          dummyArticles.map((article) => (
            <p key={article.id}>{article.title}</p>
          ))}
      </div>
    </>
  )
}

export default BmMain
