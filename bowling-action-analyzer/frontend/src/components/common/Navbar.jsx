// src/components/common/Navbar.jsx
/**
 * Navbar Component
 * ----------------
 * Main navigation bar for the application
 * 
 * Features:
 * - Sticky positioning at top
 * - Logo and brand name
 * - Navigation links with active states
 * - Theme toggle button
 * - User profile dropdown (when logged in)
 * - Responsive mobile menu
 * 
 * Uses React Router for navigation
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { MdMenu, MdClose, MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.sm};
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary.main};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary.dark};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: ${props => props.theme.colors.background.paper};
    padding: ${props => props.theme.spacing.lg};
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.isActive ? 
    props.theme.colors.primary.main : 
    props.theme.colors.text.primary};
  font-weight: ${props => props.isActive ? 
    props.theme.typography.fontWeight.semibold : 
    props.theme.typography.fontWeight.regular};
  text-decoration: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
    color: ${props => props.theme.colors.primary.main};
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/analysis', label: 'Analyze' },
    { path: '/history', label: 'History' }
  ];

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <span>🏏</span>
          <span>BowlAnalyzer</span>
        </Logo>

        <NavLinks isOpen={isMenuOpen}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              isActive={location.pathname === item.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>

        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
          </ThemeToggle>
          
          <Button variant="primary" size="sm">
            Get Started
          </Button>
          
          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </MobileMenuButton>
        </NavActions>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
