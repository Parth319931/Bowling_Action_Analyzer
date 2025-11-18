"""
Interactive Threshold Tuning Script
====================================

Purpose:
    Interactively tune thresholds by comparing detected events to visual truth.

Usage:
    python scripts/tune_thresholds.py

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import sys
sys.path.append('.')

from src.phase_segmentation import PhaseSegmentor
from src.visualization import PhaseVisualizer
from pathlib import Path

def test_config(csv_path, config):
    """Test segmentation with given config"""
    segmentor = PhaseSegmentor(config=config)
    result = segmentor.segment(csv_path)
    
    print(f"\n  Events: Jump={result['events']['jump_frame']}, "
          f"FFC={result['events']['front_foot_contact_frame']}, "
          f"Release={result['events']['ball_release_frame']}")
    print(f"  Confidence: {result['confidence']['overall']:.2f}")
    
    return result

if __name__ == '__main__':
    # Get first video
    csv_files = list(Path('data/keypoints/front_view').glob('*.csv'))
    
    if len(csv_files) == 0:
        print("No CSV files found!")
        exit()
    
    test_csv = csv_files[0]
    print(f"\n🔧 Tuning thresholds on: {test_csv.name}")
    
    # Try different configurations
    configs = [
        {'name': 'Default', 'wrist_percentile': 75, 'hip_percentile': 70},
        {'name': 'Sensitive', 'wrist_percentile': 70, 'hip_percentile': 65},
        {'name': 'Conservative', 'wrist_percentile': 80, 'hip_percentile': 75},
    ]
    
    visualizer = PhaseVisualizer()
    
    for config in configs:
        print(f"\n📊 Testing: {config['name']}")
        result = test_config(str(test_csv), config)
        
        # Save plot
        output = f"results/tune_{config['name'].lower()}_{test_csv.stem}.png"
        visualizer.plot_results(result, output)
        print(f"  Plot: {output}")
    
    print("\n✅ Review plots and choose best configuration!")
