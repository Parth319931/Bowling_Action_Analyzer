// src/pages/Analysis.jsx
/**
 * Analysis Page
 * -------------
 * Main page for uploading and analyzing bowling videos
 * 
 * Workflow:
 * 1. User uploads video
 * 2. System processes and analyzes
 * 3. Shows loading state with progress
 * 4. Redirects to results page when complete
 * 
 * Handles both front and side view uploads
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VideoUpload from '../components/analysis/VideoUpload';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const AnalysisPage = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing['2xl']} ${props => props.theme.spacing.lg};
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.primary};
`;

const PageDescription = styled.p`
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const ViewSelector = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ViewOption = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.isActive ? 
    props.theme.colors.primary.main : 
    props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.isActive ? 
    props.theme.colors.primary.main + '10' : 
    props.theme.colors.background.paper};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const Analysis = () => {
  const [selectedView, setSelectedView] = useState('front');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleUploadComplete = (analysisId) => {
    setIsAnalyzing(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      navigate(`/results/${analysisId}`);
    }, 2000);
  };

  if (isAnalyzing) {
    return (
      <AnalysisPage>
        <Card>
          <Loader 
            size="lg" 
            text="Analyzing your bowling action... This may take a moment."
          />
        </Card>
      </AnalysisPage>
    );
  }

  return (
    <AnalysisPage>
      <PageTitle>Analyze Bowling Action</PageTitle>
      <PageDescription>
        Upload your bowling video to get detailed biomechanical analysis and coaching feedback.
      </PageDescription>

      <ViewSelector>
        <ViewOption
          isActive={selectedView === 'front'}
          onClick={() => setSelectedView('front')}
        >
          <h3>Front View</h3>
          <p>Best for detecting elbow angle and front-on action</p>
        </ViewOption>
        <ViewOption
          isActive={selectedView === 'side'}
          onClick={() => setSelectedView('side')}
        >
          <h3>Side View</h3>
          <p>Best for detecting knee angle and delivery stride</p>
        </ViewOption>
      </ViewSelector>

      <Card>
        <VideoUpload onUploadComplete={handleUploadComplete} />
      </Card>
    </AnalysisPage>
  );
};

export default Analysis;
