// src/pages/Dashboard.jsx
/**
 * Dashboard Page
 * --------------
 * User dashboard showing analysis history and statistics
 * 
 * Features:
 * - Summary statistics cards
 * - Recent analyses list
 * - Progress charts
 * - Quick actions
 * 
 * For authenticated users only
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { MdVideoLibrary, MdTrendingUp, MdAssessment } from 'react-icons/md';
import { mockDashboardData } from '../services/mockData';

const DashboardPage = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.primary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const StatIcon = styled.div`
  font-size: 48px;
  color: ${props => props.color || props.theme.colors.primary.main};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RecentSection = styled.section`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const AnalysisList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const AnalysisItem = styled(Card)`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AnalysisInfo = styled.div`
  flex: 1;
`;

const AnalysisTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const AnalysisDate = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const AnalysisStatus = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => props.status === 'complete' ? 
    props.theme.colors.success + '20' : 
    props.theme.colors.warning + '20'};
  color: ${props => props.status === 'complete' ? 
    props.theme.colors.success : 
    props.theme.colors.warning};
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const data = mockDashboardData;

  return (
    <DashboardPage>
      <PageTitle>Dashboard</PageTitle>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#2E7D32">
            <MdVideoLibrary />
          </StatIcon>
          <StatContent>
            <StatValue>{data.stats.totalAnalyses}</StatValue>
            <StatLabel>Total Analyses</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#FF6B35">
            <MdTrendingUp />
          </StatIcon>
          <StatContent>
            <StatValue>{data.stats.averageElbowAngle}°</StatValue>
            <StatLabel>Avg Elbow Angle</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#2196F3">
            <MdAssessment />
          </StatIcon>
          <StatContent>
            <StatValue>{data.stats.legalActions}%</StatValue>
            <StatLabel>Legal Actions</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <RecentSection>
        <SectionHeader>
          <SectionTitle>Recent Analyses</SectionTitle>
          <Button
            variant="primary"
            onClick={() => navigate('/analysis')}
          >
            New Analysis
          </Button>
        </SectionHeader>

        <AnalysisList>
          {data.recentAnalyses.map((analysis) => (
            <AnalysisItem
              key={analysis.id}
              hoverable
              onClick={() => navigate(`/results/${analysis.id}`)}
            >
              <AnalysisInfo>
                <AnalysisTitle>{analysis.name}</AnalysisTitle>
                <AnalysisDate>{analysis.date}</AnalysisDate>
              </AnalysisInfo>
              <AnalysisStatus status={analysis.status}>
                {analysis.status}
              </AnalysisStatus>
            </AnalysisItem>
          ))}
        </AnalysisList>
      </RecentSection>
    </DashboardPage>
  );
};

export default Dashboard;
