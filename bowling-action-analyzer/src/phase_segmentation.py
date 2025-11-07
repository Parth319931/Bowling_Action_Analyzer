"""
Rule-Based Phase Segmentation Module
=====================================

Purpose:
    Detect bowling phases using rule-based peak/valley detection.
    Segments delivery into: Run-up, Delivery Stride, Release, Follow-through.

Detection Logic:
    - Ball Release: Wrist speed peak (highest velocity point)
    - Jump/Back-foot: Hip vertical position peak (highest point)
    - Front-foot Contact: Ankle velocity minimum (stationary point)
    
Phase Boundaries:
    1. Run-up: Start → Jump
    2. Delivery Stride: Jump → Front-foot Contact
    3. Release Phase: Front-foot Contact → Ball Release
    4. Follow-through: Ball Release → End

Features:
    - Adaptive thresholds (mean + std based)
    - Ordering constraints (ensures logical sequence)
    - Minimum phase durations (prevents flickering)
    - Fallback logic (handles edge cases)

Input:
    - Keypoints CSV from data/keypoints/

Output:
    - Events: Frame numbers for jump, FFC, release
    - Phases: Frame ranges for each phase
    - Key Angles: Elbow at release, knee at FFC

Usage:
    from src.phase_segmentation import PhaseSegmentor
    segmentor = PhaseSegmentor()
    result = segmentor.segment('keypoints.csv')

Research Basis:
    - Wrist speed peak method: Cricket biomechanics research
    - Hip trajectory: Standard jump phase detection
    - Temporal smoothing: CVPR 2017 TCN paper principles

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import numpy as np
from scipy.signal import find_peaks
from src.feature_engineering import FeatureExtractor

class PhaseSegmentor:
    """Rule-based bowling phase segmentation"""
    
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        
        # Tunable thresholds (adjust on Day 2 based on validation)
        self.wrist_speed_multiplier = 0.6  # Peak detection sensitivity
        self.hip_peak_multiplier = 0.3
        self.ankle_threshold = 0.02
        self.min_phase_frames = 10  # Minimum frames per phase
    
    def detect_ball_release(self, wrist_speed):
        """
        Detect ball release from wrist speed peak
        Ball release = moment of maximum wrist speed
        """
        mean_speed = np.mean(wrist_speed)
        std_speed = np.std(wrist_speed)
        
        # Find peaks above threshold
        peaks, _ = find_peaks(
            wrist_speed,
            height=mean_speed + self.wrist_speed_multiplier * std_speed,
            distance=15  # Minimum 15 frames between peaks
        )
        
        if len(peaks) > 0:
            # Return highest peak
            return peaks[np.argmax(wrist_speed[peaks])]
        
        # Fallback: maximum in second half
        return len(wrist_speed) // 2 + np.argmax(wrist_speed[len(wrist_speed)//2:])
    
    def detect_jump(self, hip_y):
        """
        Detect jump/back-foot contact from hip Y peak
        Jump = highest vertical position of hips
        """
        mean_hip = np.mean(hip_y)
        std_hip = np.std(hip_y)
        
        # Find peaks (hip goes UP during jump)
        peaks, _ = find_peaks(
            hip_y,
            height=mean_hip + self.hip_peak_multiplier * std_hip,
            distance=10
        )
        
        if len(peaks) > 0:
            return peaks[0]  # First significant peak
        
        # Fallback: 1/3 point
        return len(hip_y) // 3
    
    def detect_front_foot_contact(self, ankle_velocity, release_frame):
        """
        Detect front-foot contact from ankle velocity minimum
        Contact = moment when ankle is nearly stationary
        """
        # Search only before ball release
        search_region = ankle_velocity[:release_frame]
        
        # Find frames where ankle is stationary
        contact_candidates = np.where(np.abs(search_region) < self.ankle_threshold)[0]
        
        if len(contact_candidates) > 0:
            # Return last contact before release
            return contact_candidates[-1]
        
        # Fallback: 2/3 of way to release
        return int(release_frame * 0.67)
    
    def enforce_ordering_constraints(self, jump, ffc, release):
        """
        Ensure events occur in logical order: jump < FFC < release
        Apply minimum gaps between events
        """
        # Constraint 1: FFC must be after jump
        if ffc <= jump:
            ffc = jump + self.min_phase_frames
        
        # Constraint 2: Release must be after FFC
        if release <= ffc:
            release = ffc + self.min_phase_frames // 2
        
        return jump, ffc, release
    
    def segment(self, keypoints_csv):
        """
        Main segmentation pipeline
        
        Returns:
            dict with events, phases, key_angles, features
        """
        # Extract features
        features = self.feature_extractor.extract_all_features(keypoints_csv)
        
        # Detect key events
        release = self.detect_ball_release(features['wrist_speed'])
        jump = self.detect_jump(features['hip_y'])
        ffc = self.detect_front_foot_contact(features['ankle_velocity'], release)
        
        # Enforce ordering
        jump, ffc, release = self.enforce_ordering_constraints(jump, ffc, release)
        
        # Package events
        events = {
            'jump_frame': int(jump),
            'front_foot_contact_frame': int(ffc),
            'ball_release_frame': int(release)
        }
        
        # Define phase boundaries
        phases = {
            'run_up': (0, events['jump_frame']),
            'delivery_stride': (events['jump_frame'], events['front_foot_contact_frame']),
            'release_phase': (events['front_foot_contact_frame'], events['ball_release_frame']),
            'follow_through': (events['ball_release_frame'], features['num_frames'])
        }
        
        # Extract key angles at important moments
        key_angles = {
            'elbow_at_release': float(features['elbow_angle'][release]),
            'knee_at_ffc': float(features['knee_angle'][ffc])
        }
        
        return {
            'events': events,
            'phases': phases,
            'key_angles': key_angles,
            'features': features  # Include for visualization
        }
