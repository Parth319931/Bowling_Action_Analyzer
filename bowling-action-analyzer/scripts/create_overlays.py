"""
Batch Overlay Generation Script
================================

Purpose:
    Generate skeleton overlay videos for visual validation of pose extraction.
    Creates annotated videos showing detected joints and connections.

What it does:
    1. Reads preprocessed videos
    2. Loads corresponding keypoints CSV
    3. Draws skeleton overlay on each frame
    4. Saves annotated video

Input:
    - Preprocessed videos from data/processed_videos/
    - Keypoints CSVs from data/keypoints/

Output:
    - Overlay videos in data/overlays/front_view/ and side_view/
    - Each video shows skeleton with colored joints and connections

Run:
    python scripts/create_overlays.py

Options:
    - Process all videos or limit to first N (for quick testing)
    - Toggle frame numbers on/off
    - Select which view to process

Use Cases:
    1. Validation: Verify pose extraction quality
    2. Debugging: Identify videos with poor detection
    3. Presentation: Visual demonstration of system
    4. Documentation: Annotated examples for reports

Expected Time:
    - ~5-10 seconds per video
    - Total: ~10-15 minutes for 70 videos

Author: Teammate A - CV & Segmentation
Last Modified: Nov 6, 2025
"""

import sys
sys.path.append('.')

from src.pose_visualizer import PoseOverlayVisualizer

def create_sample_overlays():
    """Create overlays for first 3 videos (quick test)"""
    visualizer = PoseOverlayVisualizer()
    
    print("\n🎨 Creating Sample Overlays (first 3 videos)...\n")
    
    # Front view samples
    print("Creating front view overlays...")
    visualizer.batch_create_overlays(
        video_dir='data/processed_videos/front_view',
        keypoints_dir='data/keypoints/front_view',
        output_dir='data/overlays/front_view',
        max_videos=5
    )
    
    # Side view samples
    print("\nCreating side view overlays...")
    visualizer.batch_create_overlays(
        video_dir='data/processed_videos/side_view',
        keypoints_dir='data/keypoints/side_view',
        output_dir='data/overlays/side_view',
        max_videos=5
    )
    
    print("\n✅ Sample overlays created!")
    print("Check: data/overlays/front_view/ and data/overlays/side_view/")

def create_all_overlays():
    """Create overlays for all videos"""
    visualizer = PoseOverlayVisualizer()
    
    print("\n🎨 Creating Overlays for ALL Videos...\n")
    
    # Front view
    print("Creating front view overlays...")
    visualizer.batch_create_overlays(
        video_dir='data/processed_videos/front_view',
        keypoints_dir='data/keypoints/front_view',
        output_dir='data/overlays/front_view'
    )
    
    # Side view
    print("\nCreating side view overlays...")
    visualizer.batch_create_overlays(
        video_dir='data/processed_videos/side_view',
        keypoints_dir='data/keypoints/side_view',
        output_dir='data/overlays/side_view'
    )
    
    print("\n✅ All overlays created!")

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Create skeleton overlay videos')
    parser.add_argument('--mode', choices=['sample', 'all'], default='sample',
                       help='Create sample (first 3) or all overlays')
    
    args = parser.parse_args()
    
    if args.mode == 'sample':
        create_sample_overlays()
    else:
        create_all_overlays()
    
    print("\n" + "="*60)
    print("Next step: Review overlay videos to validate pose quality")
    print("="*60 + "\n")
