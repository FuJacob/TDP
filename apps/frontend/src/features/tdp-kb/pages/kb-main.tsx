import ArticleList from '../components/ArticleList';
// Import the function to get all articles
import { getAllArticles } from '../components/articleData';

const KbMain = () => {
  // Fetch articles from the data source
  const articles = getAllArticles();

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Welcome to the Knowledge Base
      </h1>
      <ArticleList articles={articles} />
    </div>
  );
};

export default KbMain;