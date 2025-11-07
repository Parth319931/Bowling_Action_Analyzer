"""
Enhanced Setup Verification Script
===================================

Purpose:
    Verify preprocessing and pose extraction with detailed statistics.
    Checks for consistency issues across dataset.

What it checks:
    1. Number of processed videos per view
    2. Video consistency (resolution, FPS)
    3. CSV file counts and structure
    4. Frame count distribution
    5. Missing pairs (front/side mismatch)

Output:
    - Detailed report of dataset statistics
    - Flags any inconsistencies or missing data
    - Recommendations for problematic videos

Run:
    python scripts/verify_setup.py

Author: Teammate A - CV & Segmentation
Last Modified: Nov 6, 2025
"""

import pandas as pd
import cv2
from pathlib import Path
import numpy as np

def verify_processed_videos():
    """Check processed video consistency"""
    print("\n🎥 Verifying Processed Videos...\n")
    
    for view in ['front_view', 'side_view']:
        video_dir = Path(f'data/processed_videos/{view}')
        videos = list(video_dir.glob('*.mp4'))
        
        if len(videos) == 0:
            print(f"⚠️  No videos in {view}")
            continue
        
        print(f"✅ {view}: {len(videos)} videos")
        
        # Check 3 sample videos for consistency
        sample_videos = videos[:3]
        for vid in sample_videos:
            cap = cv2.VideoCapture(str(vid))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            cap.release()
            
            print(f"   {vid.name}: {width}x{height} @ {fps:.1f}fps, {frame_count} frames")
            
            if width != 1280 or height != 720:
                print(f"      ⚠️  Resolution mismatch!")
            if abs(fps - 30) > 0.1:
                print(f"      ⚠️  FPS mismatch!")

def verify_keypoints():
    """Check keypoint CSV consistency"""
    print("\n🦴 Verifying Keypoint CSVs...\n")
    
    for view in ['front_view', 'side_view']:
        csv_dir = Path(f'data/keypoints/{view}')
        csvs = list(csv_dir.glob('*.csv'))
        
        if len(csvs) == 0:
            print(f"⚠️  No CSVs in {view}")
            continue
        
        print(f"✅ {view}: {len(csvs)} CSV files")
        
        # Check structure
        sample = pd.read_csv(csvs[0])
        print(f"   Sample: {csvs[0].name}")
        print(f"   Shape: {sample.shape}")
        print(f"   Columns: {len(sample.columns)} (expected: 62)")
        
        if len(sample.columns) != 62:
            print(f"   ⚠️  Column count mismatch!")
        
        # Check frame count distribution
        frame_counts = []
        for csv_path in csvs[:10]:  # Sample 10
            df = pd.read_csv(csv_path)
            frame_counts.append(len(df))
        
        print(f"   Frame counts (sample 10): min={min(frame_counts)}, max={max(frame_counts)}, avg={np.mean(frame_counts):.1f}")

def check_view_pairs():
    """Check if front and side views are paired"""
    print("\n🔗 Checking Front/Side View Pairs...\n")
    
    front_csvs = {f.stem.replace('_processed_keypoints', ''): f 
                  for f in Path('data/keypoints/front_view').glob('*.csv')}
    side_csvs = {f.stem.replace('_processed_keypoints', ''): f 
                 for f in Path('data/keypoints/side_view').glob('*.csv')}
    
    front_names = set(front_csvs.keys())
    side_names = set(side_csvs.keys())
    
    paired = front_names & side_names
    only_front = front_names - side_names
    only_side = side_names - front_names
    
    print(f"✅ Paired videos: {len(paired)}")
    
    if only_front:
        print(f"⚠️  Only front view: {len(only_front)}")
        print(f"   Examples: {list(only_front)[:3]}")
    
    if only_side:
        print(f"⚠️  Only side view: {len(only_side)}")
        print(f"   Examples: {list(only_side)[:3]}")

def main():
    """Run all verification checks"""
    print("\n" + "="*60)
    print("🔍 DATASET VERIFICATION REPORT")
    print("="*60)
    
    verify_processed_videos()
    verify_keypoints()
    check_view_pairs()
    
    print("\n" + "="*60)
    print("✅ Verification Complete!")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
