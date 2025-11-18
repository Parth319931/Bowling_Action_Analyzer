import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;
  
  ${props => props.variant === 'primary' && css`
    background-color: ${props => props.theme.colors.primary.main};
    color: ${props => props.theme.colors.primary.contrast};
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary.dark};
      transform: translateY(-1px);
      box-shadow: ${props => props.theme.shadows.md};
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: ${props => props.theme.colors.secondary.main};
    color: ${props => props.theme.colors.secondary.contrast};
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.secondary.dark};
      transform: translateY(-1px);
      box-shadow: ${props => props.theme.shadows.md};
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    color: ${props => props.theme.colors.primary.main};
    border: 2px solid ${props => props.theme.colors.primary.main};
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary.main};
      color: ${props => props.theme.colors.primary.contrast};
    }
  `}
  
  ${props => props.size === 'sm' && css`
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.typography.fontSize.sm};
  `}
  
  ${props => props.size === 'lg' && css`
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
    font-size: ${props => props.theme.typography.fontSize.lg};
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  ...props 
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </StyledButton>
  );
};

export default Button;
