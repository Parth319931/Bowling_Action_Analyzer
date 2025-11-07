"""
Phase Segmentation Testing Script
==================================

Purpose:
    Test phase segmentation on sample videos and generate validation plots.
    Quick verification that segmentation logic works correctly.

What it does:
    1. Loads sample keypoint CSVs
    2. Runs phase segmentation
    3. Prints detected events and angles
    4. Generates visualization plots

Input:
    - Keypoints CSV from data/keypoints/front_view/

Output:
    - Console output with events and angles
    - Plots in results/visualizations/

Run:
    python scripts/test_segmentation.py

Expected Output:
    🔍 Processing: bowler_001_processed_keypoints.csv
      Jump Frame: 42
      Front-Foot Contact: 68
      Ball Release: 85
      Elbow at Release: 156.3°
      Knee at FFC: 168.7°
    ✅ Plot saved: results/visualizations/bowler_001_phases.png

Use This For:
    - Day 1: Verify code works
    - Day 2: Visual inspection for threshold tuning
    - Demo: Show example outputs

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import sys
sys.path.append('.')

from src.phase_segmentation import PhaseSegmentor
from src.visualization import PhaseVisualizer
import os
from pathlib import Path

def main():
    """Test segmentation on sample videos"""
    
    segmentor = PhaseSegmentor()
    visualizer = PhaseVisualizer()
    
    # Get sample CSVs (first 3 from front view)
    csv_dir = Path('data/keypoints/front_view')
    csv_files = list(csv_dir.glob('*_keypoints.csv'))[:3]
    
    if len(csv_files) == 0:
        print("⚠️  No keypoint CSVs found!")
        print("Run: python scripts/extract_all_poses.py first")
        return
    
    os.makedirs('results/visualizations', exist_ok=True)
    
    print("\n" + "="*60)
    print("🧪 TESTING PHASE SEGMENTATION")
    print("="*60 + "\n")
    
    for csv_path in csv_files:
        print(f"🔍 Processing: {csv_path.name}")
        
        try:
            # Run segmentation
            result = segmentor.segment(str(csv_path))
            
            # Print results
            print(f"  Jump Frame: {result['events']['jump_frame']}")
            print(f"  Front-Foot Contact: {result['events']['front_foot_contact_frame']}")
            print(f"  Ball Release: {result['events']['ball_release_frame']}")
            print(f"  Elbow at Release: {result['key_angles']['elbow_at_release']:.1f}°")
            print(f"  Knee at FFC: {result['key_angles']['knee_at_ffc']:.1f}°")
            
            # Generate plot
            basename = csv_path.stem.replace('_keypoints', '')
            output_path = f'results/visualizations/{basename}_phases.png'
            
            visualizer.plot_results(result, output_path)
            print(f"  ✅ Plot saved: {output_path}\n")
            
        except Exception as e:
            print(f"  ❌ Error: {e}\n")
    
    print("="*60)
    print("✅ Testing Complete!")
    print(f"\nCheck plots in: results/visualizations/")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
