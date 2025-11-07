"""
Pose Overlay Visualization Module
==================================

Purpose:
    Create annotated videos with skeleton overlay showing detected pose landmarks.
    Useful for visual validation of pose extraction quality.

Features:
    - Draws skeleton connections between joints
    - Color-coded joints (different colors for upper/lower body)
    - Visibility-based rendering (fades low-confidence joints)
    - Side-by-side front/side view comparison
    - Frame-by-frame landmark visualization

Input:
    - Original preprocessed video
    - Corresponding keypoints CSV

Output:
    - Annotated video with skeleton overlay
    - Saved to data/overlays/front_view/ or side_view/

Usage:
    from src.pose_visualizer import PoseOverlayVisualizer
    visualizer = PoseOverlayVisualizer()
    visualizer.create_overlay('video.mp4', 'keypoints.csv', 'output.mp4')

Visual Elements:
    - Green: Upper body (shoulders, elbows, wrists)
    - Blue: Lower body (hips, knees, ankles)
    - Red: Head (nose)
    - Lines: Skeleton connections
    - Transparency: Based on landmark visibility

Dependencies:
    - opencv-python
    - pandas
    - numpy
    - mediapipe (for drawing utilities)

Author: Teammate A - CV & Segmentation
Last Modified: Nov 6, 2025
"""

import cv2
import pandas as pd
import numpy as np
import mediapipe as mp
from pathlib import Path

class PoseOverlayVisualizer:
    """Create videos with skeleton overlay"""
    
    def __init__(self):
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        self.mp_pose = mp.solutions.pose
        
        # Define skeleton connections (which joints to connect)
        self.connections = [
            # Upper body
            ('left_shoulder', 'right_shoulder'),
            ('left_shoulder', 'left_elbow'),
            ('left_elbow', 'left_wrist'),
            ('right_shoulder', 'right_elbow'),
            ('right_elbow', 'right_wrist'),
            
            # Torso
            ('left_shoulder', 'left_hip'),
            ('right_shoulder', 'right_hip'),
            ('left_hip', 'right_hip'),
            
            # Lower body
            ('left_hip', 'left_knee'),
            ('left_knee', 'left_ankle'),
            ('left_ankle', 'left_foot'),
            ('right_hip', 'right_knee'),
            ('right_knee', 'right_ankle'),
            ('right_ankle', 'right_foot'),
            
            # Head
            ('nose', 'left_shoulder'),
            ('nose', 'right_shoulder')
        ]
        
        # Color scheme
        self.colors = {
            'upper_body': (0, 255, 0),      # Green
            'lower_body': (255, 0, 0),      # Blue
            'head': (0, 0, 255),            # Red
            'connection': (255, 255, 255)   # White
        }
    
    def get_joint_color(self, joint_name):
        """Assign color based on body part"""
        if 'shoulder' in joint_name or 'elbow' in joint_name or 'wrist' in joint_name:
            return self.colors['upper_body']
        elif 'hip' in joint_name or 'knee' in joint_name or 'ankle' in joint_name or 'foot' in joint_name:
            return self.colors['lower_body']
        else:
            return self.colors['head']
    
    def draw_skeleton(self, frame, keypoints_row):
        """
        Draw skeleton on frame using keypoints from CSV row
        """
        h, w = frame.shape[:2]
        
        # Parse keypoints
        joints = {}
        for joint_name in ['nose', 'left_shoulder', 'right_shoulder', 'left_elbow', 
                          'right_elbow', 'left_wrist', 'right_wrist', 'left_hip', 
                          'right_hip', 'left_knee', 'right_knee', 'left_ankle', 
                          'right_ankle', 'left_foot', 'right_foot']:
            x = keypoints_row[f'{joint_name}_x']
            y = keypoints_row[f'{joint_name}_y']
            visibility = keypoints_row[f'{joint_name}_visibility']
            
            # Convert normalized coordinates to pixel coordinates
            joints[joint_name] = {
                'x': int(x * w),
                'y': int(y * h),
                'visibility': visibility
            }
        
        # Draw connections (skeleton lines)
        for joint1, joint2 in self.connections:
            if joint1 in joints and joint2 in joints:
                p1 = joints[joint1]
                p2 = joints[joint2]
                
                # Only draw if both joints are visible
                if p1['visibility'] > 0.5 and p2['visibility'] > 0.5:
                    cv2.line(frame, 
                            (p1['x'], p1['y']), 
                            (p2['x'], p2['y']),
                            self.colors['connection'],
                            2)
        
        # Draw joint circles
        for joint_name, joint_data in joints.items():
            if joint_data['visibility'] > 0.5:
                color = self.get_joint_color(joint_name)
                
                # Vary circle size based on visibility
                radius = int(5 * joint_data['visibility'])
                
                cv2.circle(frame, 
                          (joint_data['x'], joint_data['y']),
                          radius,
                          color,
                          -1)  # Filled circle
                
                # Add white border
                cv2.circle(frame, 
                          (joint_data['x'], joint_data['y']),
                          radius + 1,
                          (255, 255, 255),
                          1)  # Border
        
        return frame
    
    def create_overlay(self, video_path, keypoints_csv, output_path, 
                      show_frame_number=True):
        """
        Create annotated video with skeleton overlay
        
        Args:
            video_path: Path to preprocessed video
            keypoints_csv: Path to corresponding keypoints CSV
            output_path: Where to save annotated video
            show_frame_number: Whether to display frame number on video
        """
        # Load keypoints
        df = pd.read_csv(keypoints_csv)
        
        # Open video
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {video_path}")
        
        # Get video properties
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Setup video writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        frame_idx = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Get corresponding keypoints (if available)
            if frame_idx < len(df):
                keypoints_row = df.iloc[frame_idx]
                
                # Draw skeleton
                frame = self.draw_skeleton(frame, keypoints_row)
            
            # Add frame number overlay
            if show_frame_number:
                cv2.putText(frame, 
                           f"Frame: {frame_idx}", 
                           (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX,
                           0.7,
                           (255, 255, 255),
                           2)
            
            out.write(frame)
            frame_idx += 1
        
        cap.release()
        out.release()
        
        return frame_idx
    
    def batch_create_overlays(self, video_dir, keypoints_dir, output_dir, 
                             max_videos=None):
        """
        Create overlays for all videos in directory
        
        Args:
            video_dir: Directory with preprocessed videos
            keypoints_dir: Directory with keypoints CSVs
            output_dir: Where to save overlay videos
            max_videos: Maximum number to process (None = all)
        """
        import os
        from tqdm import tqdm
        
        os.makedirs(output_dir, exist_ok=True)
        
        video_files = list(Path(video_dir).glob('*.mp4'))
        
        if max_videos:
            video_files = video_files[:max_videos]
        
        print(f"Creating overlays for {len(video_files)} videos...")
        
        successful = 0
        failed = 0
        
        for video_path in tqdm(video_files, desc="Creating overlays"):
            # Find corresponding keypoints CSV
            csv_name = f"{video_path.stem}_keypoints.csv"
            csv_path = Path(keypoints_dir) / csv_name
            
            if not csv_path.exists():
                print(f"\n⚠️  Keypoints not found for {video_path.name}")
                failed += 1
                continue
            
            # Output path
            output_path = os.path.join(output_dir, f"{video_path.stem}_overlay.mp4")
            
            if os.path.exists(output_path):
                continue
            
            try:
                frames = self.create_overlay(
                    str(video_path),
                    str(csv_path),
                    output_path
                )
                successful += 1
                
            except Exception as e:
                print(f"\n✗ Error on {video_path.name}: {e}")
                failed += 1
        
        print(f"\n✅ Created {successful} overlays")
        if failed > 0:
            print(f"❌ Failed: {failed}")
