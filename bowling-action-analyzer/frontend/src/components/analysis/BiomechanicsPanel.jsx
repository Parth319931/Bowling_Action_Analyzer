// src/components/analysis/BiomechanicsPanel.jsx
/**
 * BiomechanicsPanel Component
 * ----------------------------
 * Panel displaying key biomechanical measurements
 * 
 * Features:
 * - Key angle displays with icons
 * - Legal/illegal indicators
 * - Phase duration breakdown
 * - Timing statistics
 * - Color-coded warnings
 * 
 * Props:
 * - keyAngles: Object with elbow, knee angles
 * - durations: Object with phase durations
 * - totalFrames: Total video frames
 */

import React from 'react';
import styled from 'styled-components';
import { MdCheckCircle, MdWarning, MdTimer } from 'react-icons/md';

const Panel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
`;

const MetricCard = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => props.borderColor};
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const MetricIcon = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  color: ${props => props.color};
`;

const MetricLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MetricStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.color};
`;

const BiomechanicsPanel = ({ keyAngles, durations, totalFrames }) => {
  const fps = 30;
  
  const elbowLegal = keyAngles.elbow_at_release >= 160;
  const kneeBracing = keyAngles.knee_at_ffc >= 140;
  
  const metrics = [
    {
      label: 'Elbow Angle at Release',
      value: `${keyAngles.elbow_at_release.toFixed(1)}°`,
      status: elbowLegal ? 'Legal Action' : 'Suspect Action',
      color: elbowLegal ? '#4CAF50' : '#F44336',
      icon: elbowLegal ? <MdCheckCircle /> : <MdWarning />
    },
    {
      label: 'Knee Angle at FFC',
      value: `${keyAngles.knee_at_ffc.toFixed(1)}°`,
      status: kneeBracing ? 'Good Bracing' : 'Weak Bracing',
      color: kneeBracing ? '#4CAF50' : '#FF9800',
      icon: kneeBracing ? <MdCheckCircle /> : <MdWarning />
    },
    {
      label: 'Delivery Duration',
      value: `${(durations.ffc_to_release / fps).toFixed(2)}s`,
      status: `${durations.ffc_to_release} frames`,
      color: '#2196F3',
      icon: <MdTimer />
    },
    {
      label: 'Total Action Time',
      value: `${(totalFrames / fps).toFixed(2)}s`,
      status: `${totalFrames} frames`,
      color: '#9C27B0',
      icon: <MdTimer />
    }
  ];

  return (
    <Panel>
      {metrics.map((metric, index) => (
        <MetricCard key={index} borderColor={metric.color}>
          <MetricHeader>
            <MetricIcon color={metric.color}>{metric.icon}</MetricIcon>
            <MetricLabel>{metric.label}</MetricLabel>
          </MetricHeader>
          <MetricValue>{metric.value}</MetricValue>
          <MetricStatus color={metric.color}>
            {metric.status}
          </MetricStatus>
        </MetricCard>
      ))}
    </Panel>
  );
};

export default BiomechanicsPanel;
