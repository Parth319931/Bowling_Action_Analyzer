// src/pages/Home.jsx
/**
 * Home Page
 * ---------
 * Landing page with hero section and feature highlights
 * 
 * Sections:
 * - Hero: Main call-to-action
 * - Features: Key platform capabilities
 * - How It Works: Step-by-step process
 * - CTA: Get started button
 * 
 * Designed to convert visitors into users
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdVideoLibrary, MdTimeline, MdAssessment, MdTrendingUp } from 'react-icons/md';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const HomePage = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.main} 0%, ${props => props.theme.colors.primary.dark} 100%);
  color: white;
  padding: ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing.lg};
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['5xl']};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  opacity: 0.9;
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.text.primary};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const FeatureCard = styled(Card)`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
`;

const CTASection = styled.section`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.paper};
`;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MdVideoLibrary />,
      title: 'Video Upload',
      description: 'Upload your bowling videos from any device. Supports MP4, AVI, and MOV formats.'
    },
    {
      icon: <MdTimeline />,
      title: 'Phase Detection',
      description: 'Automatic detection of run-up, jump, delivery stride, release, and follow-through phases.'
    },
    {
      icon: <MdAssessment />,
      title: 'Biomechanical Analysis',
      description: 'Detailed measurement of elbow and knee angles, timing, and movement patterns.'
    },
    {
      icon: <MdTrendingUp />,
      title: 'Performance Insights',
      description: 'Actionable coaching feedback to improve your bowling technique and consistency.'
    }
  ];

  return (
    <HomePage>
      <Hero>
        <HeroTitle>Analyze Your Bowling Action</HeroTitle>
        <HeroSubtitle>
          AI-powered biomechanical analysis for cricket bowlers
        </HeroSubtitle>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/analysis')}
        >
          Start Analysis
        </Button>
      </Hero>

      <FeaturesSection>
        <SectionTitle>Why Choose BowlAnalyzer?</SectionTitle>
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeaturesSection>

      <CTASection>
        <SectionTitle>Ready to Improve Your Action?</SectionTitle>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/analysis')}
        >
          Get Started Now
        </Button>
      </CTASection>
    </HomePage>
  );
};

export default Home;
