// src/app.tsx
import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./auth/components/AuthContext";
import { getaccountAPI } from "./api/api";
// article import
import ArticleMain from './features/tdp-kb/components/ArticleMain';


// ADD:
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const { auth, setAuth } = useAuth();
  const [appLoading, setAppLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");


      if (!token) {
        setAppLoading(false);
        return; // No token means no authentication, stop execution
      }


      try {
        const response = await getaccountAPI(); // Fetch user data
        setAuth({
          isAuthenticated: true,
          user: {
            email: response.user.email,
            name: response.user.name || response.user.email, // Fallback to email if name is missing
          },
        });
      } catch (error) {
        console.error("Failed to fetch user account:", error);
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
      } finally {
        setAppLoading(false); // Ensure loading state ends
      }
    };


    fetchUser();
  }, [setAuth]);
  const articleData = {
    title: 'Sample Article Title',
    datePosted: 'March 29, 2025',
    category: 'Tech',
    content: '<p>This is a sample article with some <strong>content</strong>!</p>',
    relatedArticles: [
      { title: 'Related Article 1', slug: 'related-article-1' },
      { title: 'Related Article 2', slug: 'related-article-2' },
    ],
  };


  return (
    <>
      <AppRoutes />
      {/* Add ToastContainer so toast notifications can appear */}
      <ToastContainer />




      <div>
      <ArticleMain
        title={articleData.title}
        datePosted={articleData.datePosted}
        category={articleData.category}
        content={articleData.content}
        relatedArticles={articleData.relatedArticles}
      />
    </div>
    </>


   
  );
}


export default App;
