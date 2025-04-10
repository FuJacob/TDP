import React from 'react';
import { ArticleCard } from './ArticleCard';
import { articleProps } from './dummy';
interface ArticleListProps {
  articles: articleProps[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          id={article.id}
          handle={article.handle}
          title={article.title}
          category={article.category}
          subtitle={article.subtitle}
          information={article.information}
          createdDate={article.createdDate}
        />
      ))}
    </div>
  );
};

export default ArticleList;
