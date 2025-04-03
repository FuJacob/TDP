import { useParams, Link } from 'react-router-dom';
// Import the dummy data. In a real app, you'd likely fetch this data based on the handle
import { getArticleByHandle } from './articleData';

const ArticleDetail = () => {
    const { articleHandle } = useParams<{ articleHandle: string }>();
    const article = getArticleByHandle(articleHandle || ''); // Find the article

    if (!article) {
        return <div className="p-4">Article not found!</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    to="/kb/kbmain"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" // Simple styled link/button
                >
                    Back to Knowledge Base
                </Link>
            </div>
            <div className="mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {article.category}
                </span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
            {article.subtitle && (
                <p className="text-xl text-gray-600 mb-6">{article.subtitle}</p>
            )}
            <div className="prose lg:prose-xl">
                <p>{article.information}</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
                Created Date: {new Date(article.createdDate || Date.now()).toLocaleDateString()}
            </p>
        </div>
    );
};

export default ArticleDetail;