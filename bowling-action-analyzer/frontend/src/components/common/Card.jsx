import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all ${props => props.theme.transitions.normal};
  
  ${props => props.hoverable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.lg};
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CardContent = styled.div`
  color: ${props => props.theme.colors.text.secondary};
`;

const Card = ({ title, children, hoverable, ...props }) => {
  return (
    <StyledCard hoverable={hoverable} {...props}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
};

export default Card;
