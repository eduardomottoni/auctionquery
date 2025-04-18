import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import AuthStatus from './AuthStatus';
import { media } from '@/styles/theme'; // Import media query helper

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px; // Example max width
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.down('sm')} { // Hide links on small screens
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const MobileMenuIcon = styled.div`
  display: none; // Hidden by default
  cursor: pointer;
  font-size: 1.5rem; // Example size

  ${media.down('sm')} { // Show only on small screens
    display: block;
  }
`;

// TODO: Implement mobile menu logic if needed
// const MobileMenu = styled.div` ... `;

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

  return (
    <StyledHeader>
      <NavContainer>
        <Link href="/" passHref legacyBehavior>
            <Logo>AuctionApp</Logo>
        </Link>

        <NavLinks>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/favorites">Favorites</NavLink>
          <NavLink href="/protected">Protected</NavLink>
          <NavLink href="/invalid-page">404 Test</NavLink>
          {/* Add other links here */}
        </NavLinks>

        {/* Placeholder for mobile menu - replace with actual icon/button */}
        <MobileMenuIcon onClick={toggleMobileMenu}>☰</MobileMenuIcon>

        {/* Auth Status fits well here */}
        <div style={{ minWidth: '250px' }}> {/* Give AuthStatus some space */}
            <AuthStatus />
        </div>
      </NavContainer>
      {/* TODO: Render actual MobileMenu based on isMobileMenuOpen state */}
      {/* {isMobileMenuOpen && <MobileMenu>...</MobileMenu>} */}
    </StyledHeader>
  );
};

export default Header; 