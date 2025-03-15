// src/components/pagelayout/PageLayout.tsx
import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="p-6 max-w-8xl mx-auto">
      {children}
    </div>
  );
};