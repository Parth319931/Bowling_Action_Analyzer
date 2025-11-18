"""
Batch Phase Segmentation Analysis
==================================

Purpose:
    Analyze pre-extracted keypoints for phase segmentation.
    Assumes keypoints CSV files already exist.

Input:
    - Keypoints CSV files in data/keypoints/front_view/

Output:
    - Phase segmentation results (JSON)
    - Visualization plots (PNG)
    - Batch summary report

Usage:
    python scripts/analyze_batch_simple.py

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import sys
sys.path.append('.')

import os
import json
from pathlib import Path
from datetime import datetime

from src.phase_segmentation import PhaseSegmentor
from src.visualization import PhaseVisualizer


def analyze_keypoints_batch(keypoints_dir, output_dir='results'):
    """
    Batch analyze keypoint CSV files
    
    Args:
        keypoints_dir: Directory containing *_keypoints.csv files
        output_dir: Where to save results
    """
    
    # Setup
    segmentor = PhaseSegmentor()
    visualizer = PhaseVisualizer()
    
    # Create output directories
    os.makedirs(f'{output_dir}/visualizations', exist_ok=True)
    os.makedirs(f'{output_dir}/reports', exist_ok=True)
    
    # Find all keypoint CSV files
    keypoints_dir = Path(keypoints_dir)
    csv_files = list(keypoints_dir.glob('*_keypoints.csv'))
    
    if len(csv_files) == 0:
        print(f"⚠️  No keypoint CSV files found in {keypoints_dir}")
        print("\nExpected files like: bowler_001_keypoints.csv")
        return
    
    print("\n" + "="*70)
    print(f"🎯 BATCH PHASE SEGMENTATION: {len(csv_files)} videos")
    print("="*70)
    
    results_list = []
    successful = 0
    failed = 0
    
    # Process each CSV
    for i, csv_path in enumerate(csv_files, 1):
        video_name = csv_path.stem.replace('_keypoints', '')
        
        print(f"\n{'─'*70}")
        print(f"[{i}/{len(csv_files)}] {video_name}")
        
        result = {
            'video_name': video_name,
            'csv_path': str(csv_path),
            'timestamp': datetime.now().isoformat()
        }
        
        try:
            # === Phase Segmentation ===
            print(f"  🎯 Detecting phases...")
            segmentation = segmentor.segment(str(csv_path))
            
            events = segmentation['events']
            phases = segmentation['phases']
            angles = segmentation['key_angles']
            durations = segmentation['durations']
            
            # Print summary
            print(f"     Events:")
            print(f"       Jump: {events['jump_frame']}")
            print(f"       BFC:  {events['back_foot_contact_frame']}")
            print(f"       FFC:  {events['front_foot_contact_frame']}")
            print(f"       Release: {events['ball_release_frame']}")
            
            print(f"     Durations:")
            print(f"       Jump→BFC: {durations['jump_to_bfc']} frames")
            print(f"       BFC→FFC:  {durations['bfc_to_ffc']} frames")
            print(f"       FFC→Release: {durations['ffc_to_release']} frames")
            
            print(f"     Key Angles:")
            print(f"       Elbow: {angles['elbow_at_release']:.1f}°")
            print(f"       Knee@FFC: {angles['knee_at_ffc']:.1f}°")
            
            # Store results
            result['status'] = 'success'
            result['events'] = events
            result['phases'] = {k: list(v) for k, v in phases.items()}
            result['key_angles'] = angles
            result['durations'] = durations
            
            # === Visualization ===
            print(f"  📊 Creating visualization...")
            viz_path = f'{output_dir}/visualizations/{video_name}_phases.png'
            visualizer.plot_results(segmentation, viz_path)
            result['visualization'] = viz_path
            
            # === Save Individual Report ===
            report_path = f'{output_dir}/reports/{video_name}_report.json'
            with open(report_path, 'w') as f:
                json.dump(result, f, indent=2)
            
            print(f"  ✅ Success")
            successful += 1
            
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            result['status'] = 'failed'
            result['error'] = str(e)
            failed += 1
        
        results_list.append(result)
    
    # === Summary ===
    print("\n" + "="*70)
    print("📊 BATCH ANALYSIS COMPLETE")
    print("="*70)
    print(f"Total Videos:  {len(csv_files)}")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed:     {failed}")
    print(f"\n📂 Results:")
    print(f"   Visualizations: {output_dir}/visualizations/")
    print(f"   Reports:        {output_dir}/reports/")
    print("="*70)
    
    # === Save Batch Summary ===
    summary = {
        'timestamp': datetime.now().isoformat(),
        'keypoints_directory': str(keypoints_dir),
        'total_videos': len(csv_files),
        'successful': successful,
        'failed': failed,
        'results': results_list
    }
    
    summary_path = f'{output_dir}/batch_summary.json'
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n💾 Summary: {summary_path}\n")
    
    return summary


def main():
    """Main function"""
    
    # Default keypoints directory
    keypoints_dir = "data/keypoints/front_view"
    
    # Check if directory exists
    if not os.path.exists(keypoints_dir):
        print(f"❌ Keypoints directory not found: {keypoints_dir}")
        print("\nExpected structure:")
        print("  data/keypoints/front_view/")
        print("    ├── bowler_001_keypoints.csv")
        print("    ├── bowler_002_keypoints.csv")
        print("    └── ...")
        sys.exit(1)
    
    # Run batch analysis
    analyze_keypoints_batch(keypoints_dir, output_dir='results')


if __name__ == '__main__':
    main()
