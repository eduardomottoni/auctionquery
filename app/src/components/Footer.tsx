import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  margin-top: auto; // Pushes footer to bottom if content is short
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      &copy; {currentYear} Constellation Auction. All rights reserved.
      {/* Add other footer links or info here */}
    </StyledFooter>
  );
};

export default Footer; 