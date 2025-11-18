// src/components/analysis/AngleChart.jsx
/**
 * AngleChart Component
 * --------------------
 * Line chart showing joint angles over time
 * 
 * Features:
 * - Displays elbow and knee angles
 * - Marks key events on chart
 * - Highlights legal/illegal angles
 * - Interactive tooltips
 * - Responsive sizing
 * 
 * Uses Recharts library for visualization
 * 
 * Props:
 * - angleData: Array of frame-by-frame angle measurements
 * - events: Object with event frame numbers
 * - angleType: 'elbow' | 'knee'
 */

import React from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';

const ChartContainer = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const ChartTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const AngleChart = ({ angleData, events, angleType = 'elbow' }) => {
  const legalThreshold = angleType === 'elbow' ? 160 : 140;
  const chartColor = angleType === 'elbow' ? '#FF6B35' : '#2E7D32';

  return (
    <ChartContainer>
      <ChartTitle>
        {angleType === 'elbow' ? 'Elbow' : 'Knee'} Angle Throughout Delivery
      </ChartTitle>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={angleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="frame" 
            label={{ value: 'Frame', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Angle (degrees)', angle: -90, position: 'insideLeft' }}
            domain={[0, 180]}
          />
          <Tooltip 
            formatter={(value) => `${value.toFixed(1)}°`}
            labelFormatter={(frame) => `Frame: ${frame}`}
          />
          <Legend />
          
          {/* Legal threshold line */}
          <ReferenceLine 
            y={legalThreshold} 
            stroke="#F44336" 
            strokeDasharray="3 3"
            label={`Legal Limit (${legalThreshold}°)`}
          />
          
          {/* Event markers */}
          {events.ball_release_frame && (
            <ReferenceLine
              x={events.ball_release_frame}
              stroke="#2196F3"
              strokeDasharray="3 3"
              label="Release"
            />
          )}
          
          <Line
            type="monotone"
            dataKey="angle"
            stroke={chartColor}
            strokeWidth={2}
            dot={false}
            name={`${angleType === 'elbow' ? 'Elbow' : 'Knee'} Angle`}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AngleChart;
