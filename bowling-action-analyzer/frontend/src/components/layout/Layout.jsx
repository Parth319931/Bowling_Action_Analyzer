// src/components/layout/Layout.jsx
/**
 * Layout Component
 * ----------------
 * Main layout wrapper for all pages
 * 
 * Features:
 * - Navbar at top
 * - Content area with max-width
 * - Footer (optional)
 * - Consistent padding and spacing
 */

import React from 'react';
import styled from 'styled-components';
import Navbar from '../common/Navbar';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

export default Layout;
