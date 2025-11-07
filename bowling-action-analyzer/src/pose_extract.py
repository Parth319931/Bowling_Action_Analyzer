import cv2
import mediapipe as mp
import pandas as pd
import numpy as np
import os
from pathlib import Path
from tqdm import tqdm

class PoseExtractor:
    """Extract pose keypoints using MediaPipe Pose"""
    
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2,
            smooth_landmarks=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        
        # 15 key joints for bowling analysis
        self.key_joints = {
            'nose': 0,
            'left_shoulder': 11, 'right_shoulder': 12,
            'left_elbow': 13, 'right_elbow': 14,
            'left_wrist': 15, 'right_wrist': 16,
            'left_hip': 23, 'right_hip': 24,
            'left_knee': 25, 'right_knee': 26,
            'left_ankle': 27, 'right_ankle': 28,
            'left_foot': 31, 'right_foot': 32
        }
    
    def extract_from_video(self, video_path, output_csv):
        """Extract pose keypoints frame by frame"""
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {video_path}")
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        keypoints_data = []
        frame_idx = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process with MediaPipe
            results = self.pose.process(frame_rgb)
            
            if results.pose_landmarks:
                # Extract key joints
                row = {'frame': frame_idx, 'timestamp': frame_idx / fps}
                
                for joint_name, landmark_idx in self.key_joints.items():
                    landmark = results.pose_landmarks.landmark[landmark_idx]
                    row[f'{joint_name}_x'] = landmark.x
                    row[f'{joint_name}_y'] = landmark.y
                    row[f'{joint_name}_z'] = landmark.z
                    row[f'{joint_name}_visibility'] = landmark.visibility
                
                keypoints_data.append(row)
            
            frame_idx += 1
        
        cap.release()
        
        # Save to CSV
        if len(keypoints_data) > 0:
            df = pd.DataFrame(keypoints_data)
            df.to_csv(output_csv, index=False)
            return len(keypoints_data)
        else:
            print(f"⚠️  No pose detected in {video_path}")
            return 0
    
    def batch_extract(self, video_dir, output_dir):
        """Extract poses from all videos"""
        os.makedirs(output_dir, exist_ok=True)
        
        video_files = list(Path(video_dir).glob('*.mp4'))
        
        if len(video_files) == 0:
            print(f"⚠️  No videos found in {video_dir}")
            return
        
        print(f"Found {len(video_files)} videos in {video_dir}")
        
        for video_path in tqdm(video_files, desc=f"Extracting {Path(video_dir).name}"):
            output_csv = os.path.join(output_dir, f"{video_path.stem}_keypoints.csv")
            
            if os.path.exists(output_csv):
                continue
            
            try:
                num_frames = self.extract_from_video(str(video_path), output_csv)
                # print(f"  ✓ {video_path.name}: {num_frames} frames")
            except Exception as e:
                print(f"  ✗ Error on {video_path.name}: {e}")
