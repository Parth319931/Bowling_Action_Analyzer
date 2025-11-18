// src/pages/Results.jsx
/**
 * Results Page
 * ------------
 * Displays comprehensive analysis results for a bowling video
 * 
 * Features:
 * - Video player with phase navigation
 * - Phase timeline visualization
 * - Biomechanics metrics panel
 * - Angle charts (elbow, knee)
 * - Coaching feedback cards
 * - Download report option
 * - Share results
 * 
 * Route: /results/:analysisId
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import VideoPlayer from '../components/analysis/VideoPlayer';
import PhaseTimeline from '../components/analysis/PhaseTimeline';
import BiomechanicsPanel from '../components/analysis/BiomechanicsPanel';
import AngleChart from '../components/analysis/AngleChart';
import FeedbackCard from '../components/analysis/FeedbackCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { MdDownload, MdShare } from 'react-icons/md';
import { mockAnalysisData } from '../services/mockData';

const ResultsPage = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Results = () => {
  const { analysisId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockAnalysisData);
      setLoading(false);
    }, 1000);
  }, [analysisId]);

  const handleDownloadReport = () => {
    // TODO: Implement PDF report download
    alert('Report download will be implemented');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share functionality will be implemented');
  };

  if (loading) {
    return (
      <ResultsPage>
        <Card>
          <Loader size="lg" text="Loading analysis results..." />
        </Card>
      </ResultsPage>
    );
  }

  return (
    <ResultsPage>
      <PageHeader>
        <PageTitle>Analysis Results</PageTitle>
        <ActionButtons>
          <Button
            variant="outline"
            icon={<MdShare />}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant="primary"
            icon={<MdDownload />}
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
        </ActionButtons>
      </PageHeader>

      {/* Video Player Section */}
      <Section>
        <SectionTitle>Video Analysis</SectionTitle>
        <VideoPlayer
          videoUrl={data.videoUrl}
          phases={data.phases}
          events={data.events}
          fps={30}
        />
      </Section>

      {/* Phase Timeline */}
      <Section>
        <SectionTitle>Phase Timeline</SectionTitle>
        <Card>
          <PhaseTimeline
            phases={data.phases}
            events={data.events}
            totalFrames={data.totalFrames}
          />
        </Card>
      </Section>

      {/* Biomechanics Metrics */}
      <Section>
        <SectionTitle>Key Biomechanical Metrics</SectionTitle>
        <BiomechanicsPanel
          keyAngles={data.keyAngles}
          durations={data.durations}
          totalFrames={data.totalFrames}
        />
      </Section>

      {/* Angle Charts */}
      <Section>
        <SectionTitle>Joint Angle Analysis</SectionTitle>
        <ChartsGrid>
          <AngleChart
            angleData={data.elbowAngleData}
            events={data.events}
            angleType="elbow"
          />
          <AngleChart
            angleData={data.kneeAngleData}
            events={data.events}
            angleType="knee"
          />
        </ChartsGrid>
      </Section>

      {/* Coaching Feedback */}
      <Section>
        <SectionTitle>Coaching Feedback</SectionTitle>
        <Card>
          <FeedbackCard feedback={data.feedback} />
        </Card>
      </Section>
    </ResultsPage>
  );
};

export default Results;
