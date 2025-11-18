"""
Enhanced Phase Segmentation Testing Script
===========================================

Purpose:
    Test order-based phase segmentation with detailed debugging output.
    Shows all detected peaks and selection reasoning.

Features:
    - Displays all peaks found in video
    - Shows why each event was selected
    - Validates phase durations
    - Creates detailed visualization
    - Saves debug report

Author: Teammate A - CV & Segmentation
Last Modified: Nov 17, 2025
"""

import sys
sys.path.append('.')

from src.phase_segmentation import OrderBasedSegmentor
from src.visualization import PhaseVisualizer
import os
import json
from pathlib import Path


def print_peak_summary(peaks_dict):
    """Print detailed summary of all detected peaks"""
    print(f"\n🔍 Peak Detection Summary:")
    
    # Hip peaks
    if len(peaks_dict['hip_peaks']['frames']) > 0:
        print(f"\n  Hip Peaks: {len(peaks_dict['hip_peaks']['frames'])}")
        for i, (frame, height, prom) in enumerate(zip(
            peaks_dict['hip_peaks']['frames'],
            peaks_dict['hip_peaks']['heights'],
            peaks_dict['hip_peaks']['prominences']
        )):
            print(f"    #{i+1}: Frame {frame:3d}, Height {height:.3f}, Prominence {prom:.3f}")
    else:
        print(f"  ⚠️  No hip peaks detected!")
    
    # Wrist peaks
    if len(peaks_dict['wrist_peaks']['frames']) > 0:
        print(f"\n  Wrist Peaks: {len(peaks_dict['wrist_peaks']['frames'])}")
        for i, (frame, height, prom) in enumerate(zip(
            peaks_dict['wrist_peaks']['frames'],
            peaks_dict['wrist_peaks']['heights'],
            peaks_dict['wrist_peaks']['prominences']
        )):
            print(f"    #{i+1}: Frame {frame:3d}, Height {height:.3f}, Prominence {prom:.3f}")
    else:
        print(f"  ⚠️  No wrist peaks detected!")
    
    # Ankle valleys
    if len(peaks_dict['ankle_valleys']['frames']) > 0:
        print(f"\n  Ankle Valleys: {len(peaks_dict['ankle_valleys']['frames'])}")
        for i, (frame, depth, prom) in enumerate(zip(
            peaks_dict['ankle_valleys']['frames'],
            peaks_dict['ankle_valleys']['depths'],
            peaks_dict['ankle_valleys']['prominences']
        )):
            print(f"    #{i+1}: Frame {frame:3d}, Depth {depth:.3f}, Prominence {prom:.3f}")
    else:
        print(f"  ⚠️  No ankle valleys detected!")


def validate_durations(durations, n_frames, fps=30):
    """Validate if phase durations are realistic"""
    print(f"\n✅ Duration Validation:")
    
    warnings = []
    
    # Check jump to BFC (should be 0.2-1.5s)
    jump_bfc_sec = durations['jump_to_bfc'] / fps
    if jump_bfc_sec < 0.2:
        warnings.append(f"⚠️  Jump→BFC very short ({jump_bfc_sec:.2f}s)")
    elif jump_bfc_sec > 1.5:
        warnings.append(f"⚠️  Jump→BFC very long ({jump_bfc_sec:.2f}s)")
    else:
        print(f"  ✓ Jump→BFC: {jump_bfc_sec:.2f}s (OK)")
    
    # Check BFC to FFC (should be 0.3-2.0s)
    bfc_ffc_sec = durations['bfc_to_ffc'] / fps
    if bfc_ffc_sec < 0.3:
        warnings.append(f"⚠️  BFC→FFC very short ({bfc_ffc_sec:.2f}s)")
    elif bfc_ffc_sec > 2.0:
        warnings.append(f"⚠️  BFC→FFC very long ({bfc_ffc_sec:.2f}s)")
    else:
        print(f"  ✓ BFC→FFC: {bfc_ffc_sec:.2f}s (OK)")
    
    # Check FFC to Release (should be 0.1-0.8s)
    ffc_rel_sec = durations['ffc_to_release'] / fps
    if ffc_rel_sec < 0.1:
        warnings.append(f"⚠️  FFC→Release very short ({ffc_rel_sec:.2f}s)")
    elif ffc_rel_sec > 0.8:
        warnings.append(f"⚠️  FFC→Release very long ({ffc_rel_sec:.2f}s)")
    else:
        print(f"  ✓ FFC→Release: {ffc_rel_sec:.2f}s (OK)")
    
    # Print warnings
    if warnings:
        print(f"\n  Warnings:")
        for warning in warnings:
            print(f"    {warning}")
    
    return len(warnings) == 0


def save_debug_report(video_name, result, output_dir):
    """Save detailed JSON report for debugging"""
    report = {
        'video_name': video_name,
        'num_frames': result['features']['num_frames'],
        'events': result['events'],
        'durations': result['durations'],
        'key_angles': result['key_angles'],
        'phases': {k: list(v) for k, v in result['phases'].items()}
    }
    
    report_path = f'{output_dir}/{video_name}_debug.json'
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    return report_path


def main():
    """Main test function"""
    
    segmentor = OrderBasedSegmentor()
    visualizer = PhaseVisualizer()
    
    # Configuration
    csv_dir = Path('data/keypoints/side_view')
    output_dir = 'results/visualizations'
    
    # Find CSV files
    csv_files = list(csv_dir.glob('*_keypoints.csv'))[:5]
    
    if len(csv_files) == 0:
        print("⚠️  No CSV files found in data/keypoints/side_view/")
        print("\nMake sure you've run:")
        print("  1. python scripts/preprocess_all.py")
        print("  2. python scripts/extract_all_poses.py")
        return
    
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(f'{output_dir}/debug_reports', exist_ok=True)
    
    print("\n" + "="*70)
    print("🧪 ORDER-BASED PHASE SEGMENTATION TEST")
    print("="*70)
    print(f"Testing {len(csv_files)} videos from side view")
    print("="*70 + "\n")
    
    successful = 0
    failed = 0
    
    for i, csv_path in enumerate(csv_files, 1):
        video_name = csv_path.stem.replace('_keypoints', '')
        
        print(f"\n{'='*70}")
        print(f"[{i}/{len(csv_files)}] 📹 {csv_path.name}")
        print(f"{'='*70}")
        
        try:
            # Run segmentation
            result = segmentor.segment(str(csv_path))
            
            # Print detected events
            print(f"\n📍 Detected Events:")
            print(f"  Jump Frame:              {result['events']['jump_frame']}")
            print(f"  Back-Foot Contact (BFC): {result['events']['back_foot_contact_frame']}")
            print(f"  Front-Foot Contact (FFC):{result['events']['front_foot_contact_frame']}")
            print(f"  Ball Release:            {result['events']['ball_release_frame']}")
            
            # Print phase durations
            print(f"\n⏱️  Phase Durations:")
            for phase, (start, end) in result['phases'].items():
                duration_frames = end - start
                duration_sec = duration_frames / 30.0
                percentage = (duration_frames / result['features']['num_frames']) * 100
                print(f"  {phase:20s}: {duration_frames:3d} frames ({duration_sec:.2f}s, {percentage:.1f}%)")
            
            # Print inter-event durations
            print(f"\n🔗 Event Gaps:")
            print(f"  Jump → BFC:      {result['durations']['jump_to_bfc']:3d} frames ({result['durations']['jump_to_bfc']/30:.2f}s)")
            print(f"  BFC → FFC:       {result['durations']['bfc_to_ffc']:3d} frames ({result['durations']['bfc_to_ffc']/30:.2f}s)")
            print(f"  FFC → Release:   {result['durations']['ffc_to_release']:3d} frames ({result['durations']['ffc_to_release']/30:.2f}s)")
            
            # Validate durations
            is_valid = validate_durations(
                result['durations'], 
                result['features']['num_frames']
            )
            
            # Print key angles
            print(f"\n📐 Key Biomechanical Angles:")
            print(f"  Elbow at Release: {result['key_angles']['elbow_at_release']:.1f}°")
            print(f"  Knee at FFC:      {result['key_angles']['knee_at_ffc']:.1f}°")
            print(f"  Knee at BFC:      {result['key_angles']['knee_at_bfc']:.1f}°")
            
            # Save visualization
            viz_path = f'{output_dir}/{video_name}_phases.png'
            visualizer.plot_results(result, viz_path)
            print(f"\n💾 Outputs:")
            print(f"  Visualization: {viz_path}")
            
            # Save debug report
            report_path = save_debug_report(
                video_name, 
                result, 
                f'{output_dir}/debug_reports'
            )
            print(f"  Debug report:  {report_path}")
            
            if is_valid:
                print(f"\n✅ Segmentation PASSED validation")
                successful += 1
            else:
                print(f"\n⚠️  Segmentation completed with warnings")
                successful += 1
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("\n🔍 Debug traceback:")
            import traceback
            traceback.print_exc()
            failed += 1
    
    # Final summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)
    print(f"Total videos:  {len(csv_files)}")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed:     {failed}")
    print(f"\n📂 Results:")
    print(f"  Visualizations: {output_dir}/")
    print(f"  Debug reports:  {output_dir}/debug_reports/")
    print("="*70 + "\n")


if __name__ == '__main__':
    main()
