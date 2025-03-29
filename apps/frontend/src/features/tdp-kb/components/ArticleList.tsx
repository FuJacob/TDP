import React from 'react';
import { ArticleCard } from './ArticleCard';

interface Article {
  id: number;
  title: string;
  summary?: string;
  category?: string;
  createdDate?: string;
}

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          title={article.title}
          summary={article.summary}
          category={article.category}
          createdDate={article.createdDate}
        />
      ))}
    </div>
  );
};

export default ArticleList;
