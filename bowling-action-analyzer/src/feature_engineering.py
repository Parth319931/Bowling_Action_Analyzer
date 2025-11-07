"""
Biomechanical Feature Engineering Module
=========================================

Purpose:
    Extract biomechanical features from pose keypoints for phase segmentation.
    Converts raw joint coordinates into meaningful motion signals.

Features Extracted:
    1. Wrist Speed (2D): Primary signal for ball release detection
    2. Hip Vertical Trajectory: Jump and stride phase detection
    3. Ankle Vertical Velocity: Foot contact detection
    4. Joint Angles: Elbow and knee angles for biomechanical analysis
    5. Temporal smoothing: Remove noise while preserving peaks

Input:
    - Keypoints CSV from data/keypoints/

Output:
    - Dictionary of time-series features per video
    - Smoothed signals ready for peak detection

Signal Processing:
    - Savitzky-Golay filter for smooth derivatives
    - Gaussian smoothing for noise reduction
    - Preserves important peaks and valleys

Usage:
    from src.feature_engineering import FeatureExtractor
    extractor = FeatureExtractor()
    features = extractor.extract_all_features('keypoints.csv')

Dependencies:
    - numpy
    - pandas
    - scipy (signal processing)

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import numpy as np
import pandas as pd
from scipy.signal import savgol_filter
from scipy.ndimage import gaussian_filter1d

class FeatureExtractor:
    """Extract biomechanical features from pose keypoints"""
    
    def __init__(self):
        pass
    
    def load_keypoints(self, csv_path):
        """Load pose keypoints from CSV"""
        return pd.read_csv(csv_path)
    
    def calculate_wrist_speed(self, df):
        """
        Calculate 2D wrist speed - PRIMARY signal for ball release
        Uses right wrist for right-handed bowler
        """
        wrist_x = df['right_wrist_x'].values
        wrist_y = df['right_wrist_y'].values
        
        # Frame-to-frame displacement
        dx = np.diff(wrist_x)
        dy = np.diff(wrist_y)
        
        # 2D Euclidean speed
        speed = np.sqrt(dx**2 + dy**2)
        speed = np.append(speed, 0)  # Pad to match length
        
        # Smooth with Savitzky-Golay filter (preserves peaks)
        if len(speed) > 5:
            speed = savgol_filter(speed, window_length=5, polyorder=2)
        
        return speed
    
    def calculate_hip_trajectory(self, df):
        """
        Hip vertical position - for jump/stride detection
        Center of mass approximation
        """
        left_hip_y = df['left_hip_y'].values
        right_hip_y = df['right_hip_y'].values
        
        # Average of both hips
        hip_y = (left_hip_y + right_hip_y) / 2
        
        # Smooth
        if len(hip_y) > 5:
            hip_y = savgol_filter(hip_y, window_length=5, polyorder=2)
        
        return hip_y
    
    def calculate_ankle_velocity(self, df):
        """
        Ankle vertical velocity - for foot contact detection
        Uses right ankle for right-handed bowler
        """
        ankle_y = df['right_ankle_y'].values
        
        # Vertical velocity (derivative)
        velocity = np.diff(ankle_y)
        velocity = np.append(velocity, 0)
        
        # Smooth with Gaussian filter
        if len(velocity) > 5:
            velocity = gaussian_filter1d(velocity, sigma=1.5)
        
        return velocity
    
    def calculate_joint_angle(self, p1, p2, p3):
        """
        Calculate angle at joint p2 between points p1-p2-p3
        Returns angle in degrees
        """
        # Vectors from p2 to p1 and p2 to p3
        v1 = p1 - p2
        v2 = p3 - p2
        
        # Angle using dot product
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
        angle = np.arccos(np.clip(cos_angle, -1, 1)) * 180 / np.pi
        
        return angle
    
    def calculate_elbow_angle(self, df):
        """
        Elbow angle over time - for arm action analysis
        """
        angles = []
        
        for i in range(len(df)):
            shoulder = np.array([
                df.iloc[i]['right_shoulder_x'],
                df.iloc[i]['right_shoulder_y']
            ])
            elbow = np.array([
                df.iloc[i]['right_elbow_x'],
                df.iloc[i]['right_elbow_y']
            ])
            wrist = np.array([
                df.iloc[i]['right_wrist_x'],
                df.iloc[i]['right_wrist_y']
            ])
            
            angle = self.calculate_joint_angle(shoulder, elbow, wrist)
            angles.append(angle)
        
        return np.array(angles)
    
    def calculate_knee_angle(self, df):
        """
        Knee angle over time - for front leg bracing analysis
        """
        angles = []
        
        for i in range(len(df)):
            hip = np.array([
                df.iloc[i]['right_hip_x'],
                df.iloc[i]['right_hip_y']
            ])
            knee = np.array([
                df.iloc[i]['right_knee_x'],
                df.iloc[i]['right_knee_y']
            ])
            ankle = np.array([
                df.iloc[i]['right_ankle_x'],
                df.iloc[i]['right_ankle_y']
            ])
            
            angle = self.calculate_joint_angle(hip, knee, ankle)
            angles.append(angle)
        
        return np.array(angles)
    
    def extract_all_features(self, csv_path):
        """
        Main feature extraction function
        Returns dictionary of all features
        """
        df = self.load_keypoints(csv_path)
        
        features = {
            'wrist_speed': self.calculate_wrist_speed(df),
            'hip_y': self.calculate_hip_trajectory(df),
            'ankle_velocity': self.calculate_ankle_velocity(df),
            'elbow_angle': self.calculate_elbow_angle(df),
            'knee_angle': self.calculate_knee_angle(df),
            'num_frames': len(df)
        }
        
        return features
