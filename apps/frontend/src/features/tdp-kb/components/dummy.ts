export type articleProps = {
  id: string,
  handle: string,
  title: string,
  category: string,
  subtitle: string,
  infomation: string,
};

export const dummyArticles: articleProps[] = [
  {
      id: "1",
      handle: "understanding-tenders",
      title: "Understanding Tenders: A Beginner's Guide",
      category: "Tenders",
      subtitle: "Learn the basics of tenders and how they work.",
      infomation: `
          <h2>What is a Tender?</h2>
          <p>A tender is a formal invitation to submit a bid for a project or procurement of goods and services. It is a way for organizations to get competitive offers for their needs.</p>
          <h3>Types of Tenders</h3>
          <ul>
              <li><strong>Open Tender:</strong> Available to all interested suppliers.</li>
              <li><strong>Selective Tender:</strong> Invitation is sent only to selected suppliers.</li>
              <li><strong>Negotiated Tender:</strong> A contract is negotiated with one supplier.</li>
          </ul>
          <h3>Why are Tenders Important?</h3>
          <p>Tenders help businesses compete on a level playing field and allow organizations to get the best value for their needs.</p>
      `
  },
  {
      id: "2",
      handle: "how-to-apply-for-tenders",
      title: "How to Apply for Tenders: A Step-by-Step Guide",
      category: "Tenders",
      subtitle: "The essential steps for applying to tenders effectively.",
      infomation: `
          <h2>Steps to Apply for a Tender</h2>
          <p>Applying for a tender can be a complex process. However, understanding the necessary steps can make the process much smoother.</p>
          <h3>Step 1: Research the Tender Requirements</h3>
          <p>Before applying, ensure that you meet the requirements outlined in the tender document.</p>
          <h3>Step 2: Prepare Your Documents</h3>
          <ul>
              <li>Company registration proof</li>
              <li>Financial documents</li>
              <li>Technical capabilities</li>
          </ul>
          <h3>Step 3: Submit Your Application</h3>
          <p>Submit your completed documents before the deadline to avoid disqualification.</p>
      `
  },
  {
      id: "3",
      handle: "understanding-government-regulations",
      title: "Understanding Government Regulations: Key Legal Frameworks",
      category: "Government Regulations",
      subtitle: "A guide to navigating the legal framework of tenders and procurement.",
      infomation: `
          <h2>What Are Government Regulations?</h2>
          <p>Government regulations are rules created by government bodies to ensure fairness and transparency in tendering processes.</p>
          <h3>Why Regulations Matter?</h3>
          <p>Regulations ensure that tenders are awarded based on merit, and they protect public funds from misuse.</p>
          <h3>Key Regulations in Tendering</h3>
          <ul>
              <li><strong>Procurement Laws:</strong> Ensure transparency in the purchasing process.</li>
              <li><strong>Environmental Standards:</strong> Ensures that tenders comply with environmental safety standards.</li>
              <li><strong>Anti-Corruption Measures:</strong> Prevents unethical practices in the tendering process.</li>
          </ul>
      `
  },
  {
      id: "4",
      handle: "tender-compliance-checklist",
      title: "Tender Compliance Checklist",
      category: "Government Regulations",
      subtitle: "A simple checklist to ensure your tender meets compliance standards.",
      infomation: `
          <h2>Compliance Checklist for Tenders</h2>
          <p>Ensuring that your tender is compliant with legal and regulatory standards is crucial for its acceptance.</p>
          <h3>Essential Documents</h3>
          <ul>
              <li>Valid company registration</li>
              <li>Up-to-date financial statements</li>
              <li>Compliance certificates (e.g., safety, environmental)</li>
          </ul>
          <h3>Compliance Areas</h3>
          <p>Your tender should also meet requirements such as:</p>
          <ul>
              <li>Timely submission</li>
              <li>Properly filled out forms</li>
              <li>Clear and transparent pricing</li>
          </ul>
      `
  },
  {
      id: "5",
      handle: "latest-tender-opportunities",
      title: "Latest Tender Opportunities: New Openings",
      category: "News",
      subtitle: "Keep an eye out for new tenders in various sectors.",
      infomation: `
          <h2>Upcoming Tender Opportunities</h2>
          <p>Here are some of the latest tenders you can apply for:</p>
          <ul>
              <li><strong>Infrastructure Development:</strong> Deadline: April 15, 2025</li>
              <li><strong>IT Solutions:</strong> Deadline: May 1, 2025</li>
          </ul>
          <p>Stay informed on the latest opportunities to ensure you never miss a tender deadline!</p>
      `
  },
  {
      id: "6",
      handle: "industry-news-on-tendering",
      title: "Industry News: New Changes in Tendering Policies",
      category: "News",
      subtitle: "Recent updates and changes in tendering policies that you need to know.",
      infomation: `
          <h2>Changes in Tendering Policies</h2>
          <p>The government has recently made key changes to its tendering process. Here's what you need to know:</p>
          <h3>New Policy Updates</h3>
          <ul>
              <li><strong>Increased Transparency:</strong> Clearer evaluation criteria for tender submissions.</li>
              <li><strong>Sustainability Standards:</strong> New requirements for eco-friendly tenders.</li>
              <li><strong>Financial Eligibility:</strong> More stringent financial eligibility checks for tenders.</li>
          </ul>
          <p>These changes aim to make the process more competitive, transparent, and sustainable.</p>
      `
  }
];
