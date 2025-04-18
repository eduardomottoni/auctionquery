import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

// Ensures the main content area takes up available space,
// pushing the footer down.
const MainContent = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: 1200px; // Match header/footer max-width if desired
  margin: 0 auto; // Center content
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </>
  );
};

export default Layout; 