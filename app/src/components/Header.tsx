import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import AuthStatus from './AuthStatus';
import { media } from '@/styles/theme'; // Import media query helper
import { useTheme } from '@/context/ThemeContext'; // Import useTheme hook
import Button from '@/components/ui/Button'; // Import Button

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.lg}; // Increased bottom padding
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg}; // Added margin-bottom for space
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
  z-index: 1100; // Ensure icon is above overlay
  position: relative; // Needed for z-index

  ${media.down('sm')} { // Show only on small screens
    display: block;
  }
`;

// --- Mobile Menu Components ---
const MenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050; // Below drawer, above content
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  ${media.up('sm')} { // Hide overlay on larger screens
      display: none;
  }
`;

const MobileMenuDrawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 250px; // Adjust width as needed
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: -2px 0 5px rgba(0,0,0,0.2);
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 60px; // Space for header/close button
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1100; // Above overlay
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  ${media.up('sm')} { // Hide drawer on larger screens
      display: none;
  }

  // Style links inside the drawer
  ${NavLink} {
      display: block;
      width: 100%;
      text-align: left;
      padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const { themeMode, toggleTheme } = useTheme(); // Use the theme hook

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Close menu if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is outside menu and icon
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                iconRef.current && !iconRef.current.contains(event.target as Node)
             ) {
                closeMobileMenu();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

  return (
    <StyledHeader>
      <NavContainer>
        <Link href="/" passHref legacyBehavior>
            <Logo>AuctionApp</Logo>
        </Link>

        <NavLinks>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/protected">Protected</NavLink>
          <NavLink href="/invalid-page">404 Test</NavLink>
          {/* Add other links here */}
        </NavLinks>

        {/* Container for right-side items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}> 
          {/* Theme Toggle Button */}
          <Button 
            onClick={toggleTheme} 
            variant="ghost" 
            size="sm" 
            title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
            style={{ padding: '0.5rem' }} // Adjust padding if needed
          >
            {themeMode === 'light' ? '🌙' : '☀️'} {/* Moon/Sun Icon */}
          </Button>

          <div style={{ flexShrink: 1 }}> 
              <AuthStatus />
          </div>
          <MobileMenuIcon onClick={toggleMobileMenu} ref={iconRef}>
              {isMobileMenuOpen ? '✕' : '☰'} {/* Change icon when open */}
          </MobileMenuIcon>
        </div>
      </NavContainer>

      {/* Mobile Menu Implementation */}
      <MenuOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenuDrawer isOpen={isMobileMenuOpen} ref={menuRef}>
        {/* Add links - use onClick to close menu after navigation */}
        <NavLink href="/" onClick={closeMobileMenu}>Home</NavLink>
        <NavLink href="/protected" onClick={closeMobileMenu}>Protected</NavLink>
        <NavLink href="/invalid-page" onClick={closeMobileMenu}>404 Test</NavLink>
        {/* Maybe add AuthStatus or Logout here too? */}
      </MobileMenuDrawer>
    </StyledHeader>
  );
};

export default Header; 