// src/components/analysis/PhaseTimeline.jsx
/**
 * PhaseTimeline Component
 * -----------------------
 * Visual timeline showing detected bowling phases
 * 
 * Features:
 * - Color-coded phase segments
 * - Event markers (jump, BFC, FFC, release)
 * - Interactive hover states
 * - Duration labels
 * - Percentage indicators
 * - Responsive width
 * 
 * Props:
 * - phases: Object with phase boundaries
 * - events: Object with event frame numbers
 * - totalFrames: Total frames in video
 * - onPhaseClick: Callback when phase is clicked
 */

import React from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
`;

const TimelineBar = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const PhaseSegment = styled.div`
  flex: ${props => props.width};
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  
  &:hover {
    filter: brightness(1.1);
    transform: scaleY(1.05);
  }
`;

const EventMarkers = styled.div`
  display: flex;
  position: relative;
  margin-top: ${props => props.theme.spacing.md};
  height: 40px;
`;

const EventMarker = styled.div`
  position: absolute;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkerDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary.main};
  border: 2px solid ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.md};
`;

const MarkerLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.xs};
  white-space: nowrap;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.color};
`;

const LegendText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const PhaseTimeline = ({ phases, events, totalFrames, onPhaseClick }) => {
  const phaseColors = {
    run_up: '#64B5F6',
    jump_phase: '#FFB74D',
    delivery_stride: '#81C784',
    release_phase: '#E57373',
    follow_through: '#9575CD'
  };

  const phaseLabels = {
    run_up: 'Run-up',
    jump_phase: 'Jump',
    delivery_stride: 'Delivery Stride',
    release_phase: 'Release',
    follow_through: 'Follow-through'
  };

  const eventLabels = {
    jump_frame: 'Jump',
    back_foot_contact_frame: 'BFC',
    front_foot_contact_frame: 'FFC',
    ball_release_frame: 'Release'
  };

  return (
    <TimelineContainer>
      <TimelineBar>
        {Object.entries(phases).map(([phaseName, [start, end]]) => {
          const duration = end - start;
          const percentage = ((duration / totalFrames) * 100).toFixed(1);
          
          return (
            <PhaseSegment
              key={phaseName}
              width={duration}
              color={phaseColors[phaseName]}
              onClick={() => onPhaseClick?.(phaseName)}
              title={`${phaseLabels[phaseName]}: ${duration} frames (${percentage}%)`}
            >
              {duration > 15 && percentage > 8 ? phaseLabels[phaseName] : ''}
            </PhaseSegment>
          );
        })}
      </TimelineBar>

      <EventMarkers>
        {Object.entries(events).map(([eventName, frame]) => {
          const position = (frame / totalFrames) * 100;
          
          return (
            <EventMarker key={eventName} position={position}>
              <MarkerDot />
              <MarkerLabel>{eventLabels[eventName]}</MarkerLabel>
            </EventMarker>
          );
        })}
      </EventMarkers>

      <Legend>
        {Object.entries(phaseLabels).map(([key, label]) => (
          <LegendItem key={key}>
            <LegendColor color={phaseColors[key]} />
            <LegendText>{label}</LegendText>
          </LegendItem>
        ))}
      </Legend>
    </TimelineContainer>
  );
};

export default PhaseTimeline;
