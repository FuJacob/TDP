// tdp-kb/components/ArticleMain.tsx
import React from 'react';


interface ArticleMainProps {
  title: string;
  datePosted: string;
  category: string;
  content: string;
  relatedArticles: { title: string; slug: string }[];
}


const ArticleMain: React.FC<ArticleMainProps> = ({ title, datePosted, category, content, relatedArticles }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center' }}>
        <h1>{title}</h1>
        <p style={{ fontSize: '14px', color: '#777' }}>
          <span>{datePosted}</span> | <span>{category}</span>
        </p>
      </header>


      <main style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '16px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: content }} />
      </main>


      <section style={{ marginTop: '40px' }}>
        <h2>Related Articles</h2>
        <ul style={{ padding: 0, listStyleType: 'none' }}>
          {relatedArticles.map((article) => (
            <li key={article.slug} style={{ margin: '5px 0' }}>
              <a href={`/article/${article.slug}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};


export default ArticleMain;