import { articleProps } from '../components/dummy';
export const allArticles: articleProps[] = [
  {
    id: 'kb-1',
    handle: 'how-to-submit-tender', // Unique handle for URL
    title: 'How to Submit a Tender',
    subtitle: 'A comprehensive walkthrough',
    information: 'This guide provides a step-by-step process for successfully submitting your tender documents through the platform.', // Renamed from summary
    category: 'Guide',
    createdDate: '2025-03-01',
  },
  {
    id: 'kb-2',
    handle: 'faqs-about-bidding',
    title: 'FAQs About Bidding',
    subtitle: 'Answers to your common questions',
    information: 'Find answers to the most frequently asked questions regarding the bidding process, requirements, and timelines.',
    category: 'FAQ',
    createdDate: '2025-02-20',
  },
  {
    id: 'kb-3',
    handle: 'understanding-evaluation-criteria',
    title: 'Understanding Evaluation Criteria',
    subtitle: 'Learn how bids are scored',
    information: 'An explanation of the common criteria used to evaluate tender submissions and how scoring works.',
    category: 'Info',
    createdDate: '2025-02-10',
  },
];

// Function to find an article by its handle
export const getArticleByHandle = (handle: string): articleProps | undefined => {
  return allArticles.find(article => article.handle === handle);
};

// Function to get all articles (used by KbMain)
export const getAllArticles = (): articleProps[] => {
    return allArticles;
}