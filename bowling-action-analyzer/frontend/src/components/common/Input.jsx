// src/components/common/Input.jsx
/**
 * Input Component
 * ---------------
 * Reusable styled input field with label, error states, and icons
 * 
 * Features:
 * - Supports text, email, password, number types
 * - Optional left/right icons
 * - Error state with message display
 * - Full width or fixed width variants
 * - Consistent styling with theme
 * 
 * Props:
 * - label: Input label text
 * - error: Error message to display
 * - icon: Icon component to display (left side)
 * - fullWidth: Boolean for full width styling
 * - All standard input props (type, placeholder, value, onChange, etc.)
 */

import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: ${props => props.hasIcon ? props.theme.spacing['2xl'] : props.theme.spacing.md};
  border: 2px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => props.theme.colors.background.paper};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? props.theme.colors.error : props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.error ? 
      props.theme.colors.error + '20' : 
      props.theme.colors.primary.main + '20'};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.disabled};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.error};
`;

const Input = ({ label, error, icon, fullWidth, ...props }) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <StyledInput hasIcon={!!icon} error={error} {...props} />
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
