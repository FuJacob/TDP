// tdp-kb/pages/article-page.tsx
import React from 'react';
import ArticleMain from '../components/ArticleMain';


interface ArticlePageProps {
  title: string;
  datePosted: string;
  category: string;
  content: string;
  relatedArticles: { title: string; slug: string }[];
}


const ArticlePage: React.FC<ArticlePageProps> = ({ title, datePosted, category, content, relatedArticles }) => {
  return (
    <div className="article-page">
      <ArticleMain
        title={title}
        datePosted={datePosted}
        category={category}
        content={content}
        relatedArticles={relatedArticles}
      />
    </div>
  );
};


export default ArticlePage;
