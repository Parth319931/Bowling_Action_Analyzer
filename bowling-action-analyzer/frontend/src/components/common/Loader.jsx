// src/components/common/Loader.jsx
/**
 * Loader Component
 * ----------------
 * Animated loading spinner with optional text
 * 
 * Features:
 * - Smooth CSS animation
 * - Multiple size variants (sm, md, lg)
 * - Optional loading text below spinner
 * - Theme-aware colors
 * - Can be used inline or as full-page overlay
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - text: Optional loading message
 * - fullscreen: Boolean for full-screen overlay
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  
  ${props => props.fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  `}
`;

const Spinner = styled.div`
  border: 3px solid ${props => props.theme.colors.neutral[200]};
  border-top: 3px solid ${props => props.theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  
  ${props => props.size === 'sm' && `
    width: 24px;
    height: 24px;
  `}
  
  ${props => props.size === 'md' && `
    width: 40px;
    height: 40px;
  `}
  
  ${props => props.size === 'lg' && `
    width: 60px;
    height: 60px;
    border-width: 4px;
  `}
`;

const LoaderText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.fullscreen ? '#FFFFFF' : props.theme.colors.text.secondary};
  margin: 0;
`;

const Loader = ({ size = 'md', text, fullscreen }) => {
  return (
    <LoaderContainer fullscreen={fullscreen}>
      <Spinner size={size} />
      {text && <LoaderText fullscreen={fullscreen}>{text}</LoaderText>}
    </LoaderContainer>
  );
};

export default Loader;
