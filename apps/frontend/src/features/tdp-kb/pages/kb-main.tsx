import React, { useState } from 'react';
import ArticleList from '../components/ArticleList';

const KbMain = () => {
  const [articles] = useState([
    {
      id: 1,
      title: 'How to Submit a Tender',
      summary: 'Step-by-step guide for tender submission.',
      category: 'Guide',
      createdDate: '2025-03-01',
    },
    {
      id: 2,
      title: 'FAQs About Bidding',
      summary: 'Common questions answered.',
      category: 'FAQ',
      createdDate: '2025-02-20',
    },
    {
      id: 3,
      title: 'Understanding Evaluation Criteria',
      summary: 'How tenders are evaluated and scored.',
      category: 'Info',
      createdDate: '2025-02-10',
    },
  ]);

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
