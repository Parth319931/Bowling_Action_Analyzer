// src/services/mockData.js
/**
 * Mock Data Service
 * ------------------
 * Provides sample data for development and testing
 * 
 * Data includes:
 * - Complete analysis results
 * - Dashboard statistics
 * - Analysis history
 * - Angle measurements
 * - Phase timings
 * 
 * TODO: Replace with actual API calls when backend is ready
 */

export const mockAnalysisData = {
  videoUrl: '/sample-video.mp4', // Replace with actual video URL
  totalFrames: 120,
  
  events: {
    jump_frame: 34,
    back_foot_contact_frame: 50,
    front_foot_contact_frame: 72,
    ball_release_frame: 86
  },
  
  phases: {
    run_up: [0, 34],
    jump_phase: [34, 50],
    delivery_stride: [50, 72],
    release_phase: [72, 86],
    follow_through: [86, 120]
  },
  
  keyAngles: {
    elbow_at_release: 165.3,
    knee_at_ffc: 162.7,
    knee_at_bfc: 148.5
  },
  
  durations: {
    jump_to_bfc: 16,
    bfc_to_ffc: 22,
    ffc_to_release: 14
  },
  
  // Frame-by-frame elbow angle data
  elbowAngleData: Array.from({ length: 120 }, (_, i) => ({
    frame: i,
    angle: 140 + Math.sin(i / 10) * 20 + (i > 80 ? (i - 80) * 0.5 : 0)
  })),
  
  // Frame-by-frame knee angle data
  kneeAngleData: Array.from({ length: 120 }, (_, i) => ({
    frame: i,
    angle: 150 + Math.cos(i / 8) * 15 + (i > 70 ? -10 : 0)
  })),
  
  feedback: [
    {
      severity: 'success',
      title: 'Legal Bowling Action',
      message: 'Elbow angle at release is 165.3°, which is within legal limits.',
      details: 'Your elbow extension is well within the ICC legal limit of 15 degrees. Continue maintaining this technique.',
      recommendations: [
        'Maintain consistent arm positioning',
        'Focus on shoulder rotation for additional pace'
      ]
    },
    {
      severity: 'warning',
      title: 'Knee Bracing Could Be Improved',
      message: 'Knee angle at front-foot contact is 162.7°, slightly lower than optimal.',
      details: 'A straighter front leg provides better energy transfer and reduces injury risk. Aim for 165-175 degrees at front-foot contact.',
      recommendations: [
        'Work on front leg strength exercises',
        'Practice landing with a straighter knee',
        'Focus on pushing through the crease'
      ]
    },
    {
      severity: 'info',
      title: 'Good Timing',
      message: 'Phase durations are well-balanced.',
      details: 'Your delivery stride and release timing show good rhythm. The 0.47s from FFC to release is efficient.'
    }
  ]
};

export const mockDashboardData = {
  stats: {
    totalAnalyses: 24,
    averageElbowAngle: 163.5,
    legalActions: 87
  },
  
  recentAnalyses: [
    {
      id: 'analysis_1',
      name: 'Training Session - Day 5',
      date: '2025-11-18',
      status: 'complete',
      viewType: 'front'
    },
    {
      id: 'analysis_2',
      name: 'Match Practice',
      date: '2025-11-17',
      status: 'complete',
      viewType: 'side'
    },
    {
      id: 'analysis_3',
      name: 'Speed Test',
      date: '2025-11-15',
      status: 'complete',
      viewType: 'front'
    }
  ]
};

export const mockHistoryData = [
  {
    id: 'analysis_1',
    name: 'Training Session - Day 5',
    date: '2025-11-18',
    viewType: 'front',
    elbowAngle: 165.3,
    status: 'complete'
  },
  {
    id: 'analysis_2',
    name: 'Match Practice',
    date: '2025-11-17',
    viewType: 'side',
    elbowAngle: 158.2,
    status: 'complete'
  },
  {
    id: 'analysis_3',
    name: 'Speed Test',
    date: '2025-11-15',
    viewType: 'front',
    elbowAngle: 162.7,
    status: 'complete'
  },
  {
    id: 'analysis_4',
    name: 'Technique Refinement',
    date: '2025-11-14',
    viewType: 'side',
    elbowAngle: 167.1,
    status: 'complete'
  }
];
