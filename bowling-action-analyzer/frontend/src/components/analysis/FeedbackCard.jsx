// src/components/analysis/FeedbackCard.jsx
/**
 * FeedbackCard Component
 * ----------------------
 * Displays actionable coaching feedback based on analysis
 * 
 * Features:
 * - Categorized feedback (errors, warnings, tips)
 * - Color-coded severity indicators
 * - Icon-based visual cues
 * - Expandable detailed explanations
 * - Action recommendations
 * 
 * Props:
 * - feedback: Array of feedback objects
 * - severity: 'error' | 'warning' | 'info' | 'success'
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { MdError, MdWarning, MdInfo, MdCheckCircle, MdExpandMore, MdExpandLess } from 'react-icons/md';

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FeedbackItem = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-left: 4px solid ${props => props.borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
`;

const FeedbackLeft = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const FeedbackIcon = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.color};
  margin-top: 2px;
`;

const FeedbackContent = styled.div`
  flex: 1;
`;

const FeedbackTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const FeedbackMessage = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.xl};
  padding: 0;
  display: flex;
  align-items: center;
`;

const FeedbackDetails = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.neutral[200]};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.6;
`;

const RecommendationList = styled.ul`
  margin: ${props => props.theme.spacing.sm} 0 0 ${props => props.theme.spacing.lg};
  padding: 0;
`;

const FeedbackCard = ({ feedback = [] }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const getSeverityConfig = (severity) => {
    const configs = {
      error: {
        icon: <MdError />,
        color: '#F44336',
        bgColor: '#FFEBEE'
      },
      warning: {
        icon: <MdWarning />,
        color: '#FF9800',
        bgColor: '#FFF3E0'
      },
      info: {
        icon: <MdInfo />,
        color: '#2196F3',
        bgColor: '#E3F2FD'
      },
      success: {
        icon: <MdCheckCircle />,
        color: '#4CAF50',
        bgColor: '#E8F5E9'
      }
    };
    return configs[severity] || configs.info;
  };

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <FeedbackContainer>
      {feedback.map((item, index) => {
        const config = getSeverityConfig(item.severity);
        const isExpanded = expandedItems[index];

        return (
          <FeedbackItem key={index} borderColor={config.color}>
            <FeedbackHeader onClick={() => toggleExpand(index)}>
              <FeedbackLeft>
                <FeedbackIcon color={config.color}>
                  {config.icon}
                </FeedbackIcon>
                <FeedbackContent>
                  <FeedbackTitle>{item.title}</FeedbackTitle>
                  <FeedbackMessage>{item.message}</FeedbackMessage>
                </FeedbackContent>
              </FeedbackLeft>
              {item.details && (
                <ExpandButton>
                  {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                </ExpandButton>
              )}
            </FeedbackHeader>

            {isExpanded && item.details && (
              <FeedbackDetails>
                <p>{item.details}</p>
                {item.recommendations && (
                  <>
                    <strong>Recommendations:</strong>
                    <RecommendationList>
                      {item.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </RecommendationList>
                  </>
                )}
              </FeedbackDetails>
            )}
          </FeedbackItem>
        );
      })}
    </FeedbackContainer>
  );
};

export default FeedbackCard;
