"""
Complete End-to-End Bowling Video Analysis
===========================================

Purpose:
    Process a single video from raw input to phase segmentation results.
    
Pipeline:
    1. Preprocess video (resize, standardize FPS)
    2. Extract pose keypoints (MediaPipe)
    3. Calculate biomechanical features
    4. Detect bowling phases (rule-based)
    5. Generate visualization
    6. Save results

Usage:
    python scripts/analyze_video.py path/to/video.mp4

Output:
    - Processed video
    - Keypoints CSV
    - Phase segmentation results (JSON)
    - Visualization plot
    - Summary report

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import sys
sys.path.append('.')

import os
import json
import argparse
from pathlib import Path
from datetime import datetime

from src.preprocess import VideoPreprocessor
from src.pose_extract import PoseExtractor
from src.phase_segmentation import PhaseSegmentor
from src.visualization import PhaseVisualizer


class BowlingVideoAnalyzer:
    """Complete end-to-end video analysis pipeline"""
    
    def __init__(self, output_dir='results'):
        self.output_dir = output_dir
        self.preprocessor = VideoPreprocessor()
        self.pose_extractor = PoseExtractor()
        self.segmentor = PhaseSegmentor()
        self.visualizer = PhaseVisualizer()
        
        # Create output directories
        os.makedirs(f'{output_dir}/processed_videos', exist_ok=True)
        os.makedirs(f'{output_dir}/keypoints', exist_ok=True)
        os.makedirs(f'{output_dir}/visualizations', exist_ok=True)
        os.makedirs(f'{output_dir}/reports', exist_ok=True)
    
    def analyze(self, video_path):
        """
        Complete analysis pipeline for a single video
        
        Args:
            video_path: Path to raw video file
            
        Returns:
            dict with all results
        """
        video_name = Path(video_path).stem
        
        print("\n" + "="*70)
        print(f"🎬 ANALYZING VIDEO: {video_name}")
        print("="*70 + "\n")
        
        # Check if video exists
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video not found: {video_path}")
        
        results = {
            'video_name': video_name,
            'video_path': video_path,
            'timestamp': datetime.now().isoformat(),
            'pipeline_steps': {}
        }
        
        # ===== STEP 1: Preprocess Video =====
        print("📹 STEP 1/4: Preprocessing video...")
        processed_video_path = f'{self.output_dir}/processed_videos/{video_name}_processed.mp4'
        
        try:
            num_frames = self.preprocessor.preprocess_video(video_path, processed_video_path)
            print(f"   ✅ Video preprocessed: {num_frames} frames")
            print(f"   📁 Saved to: {processed_video_path}")
            
            results['pipeline_steps']['preprocessing'] = {
                'status': 'success',
                'output_path': processed_video_path,
                'num_frames': num_frames
            }
        except Exception as e:
            print(f"   ❌ Preprocessing failed: {e}")
            results['pipeline_steps']['preprocessing'] = {
                'status': 'failed',
                'error': str(e)
            }
            return results
        
        # ===== STEP 2: Extract Pose Keypoints =====
        print("\n🦴 STEP 2/4: Extracting pose keypoints...")
        keypoints_csv = f'{self.output_dir}/keypoints/{video_name}_keypoints.csv'
        
        try:
            num_detected = self.pose_extractor.extract_from_video(
                processed_video_path, 
                keypoints_csv
            )
            print(f"   ✅ Pose extracted: {num_detected} frames with pose detected")
            print(f"   📁 Saved to: {keypoints_csv}")
            
            results['pipeline_steps']['pose_extraction'] = {
                'status': 'success',
                'output_path': keypoints_csv,
                'frames_detected': num_detected
            }
        except Exception as e:
            print(f"   ❌ Pose extraction failed: {e}")
            results['pipeline_steps']['pose_extraction'] = {
                'status': 'failed',
                'error': str(e)
            }
            return results
        
        # ===== STEP 3: Phase Segmentation =====
        print("\n🎯 STEP 3/4: Detecting bowling phases...")
        
        try:
            segmentation_result = self.segmentor.segment(keypoints_csv)
            
            events = segmentation_result['events']
            phases = segmentation_result['phases']
            angles = segmentation_result['key_angles']
            
            print(f"\n   📍 Detected Events:")
            print(f"      Jump:                {events['jump_frame']}")
            print(f"      Back-Foot Contact:   {events['back_foot_contact_frame']}")
            print(f"      Front-Foot Contact:  {events['front_foot_contact_frame']}")
            print(f"      Ball Release:        {events['ball_release_frame']}")
            
            print(f"\n   ⏱️  Phase Durations:")
            for phase_name, (start, end) in phases.items():
                duration_frames = end - start
                duration_sec = duration_frames / 30.0  # 30 fps
                print(f"      {phase_name:20s}: {duration_frames:3d} frames ({duration_sec:.2f}s)")
            
            print(f"\n   📐 Key Biomechanical Angles:")
            print(f"      Elbow at Release: {angles['elbow_at_release']:.1f}°")
            print(f"      Knee at FFC:      {angles['knee_at_ffc']:.1f}°")
            print(f"      Knee at BFC:      {angles['knee_at_bfc']:.1f}°")
            
            results['pipeline_steps']['segmentation'] = {
                'status': 'success',
                'events': events,
                'phases': {k: list(v) for k, v in phases.items()},
                'key_angles': angles
            }
        except Exception as e:
            print(f"   ❌ Segmentation failed: {e}")
            results['pipeline_steps']['segmentation'] = {
                'status': 'failed',
                'error': str(e)
            }
            return results
        
        # ===== STEP 4: Generate Visualization =====
        print("\n📊 STEP 4/4: Generating visualization...")
        viz_path = f'{self.output_dir}/visualizations/{video_name}_analysis.png'
        
        try:
            self.visualizer.plot_results(segmentation_result, viz_path)
            print(f"   ✅ Visualization created")
            print(f"   📁 Saved to: {viz_path}")
            
            results['pipeline_steps']['visualization'] = {
                'status': 'success',
                'output_path': viz_path
            }
        except Exception as e:
            print(f"   ❌ Visualization failed: {e}")
            results['pipeline_steps']['visualization'] = {
                'status': 'failed',
                'error': str(e)
            }
        
        # ===== Save Complete Report =====
        report_path = f'{self.output_dir}/reports/{video_name}_report.json'
        with open(report_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n💾 Complete report saved to: {report_path}")
        
        # ===== Print Summary =====
        print("\n" + "="*70)
        print("✅ ANALYSIS COMPLETE!")
        print("="*70)
        print(f"\n📂 Output Files:")
        print(f"   Processed Video:  {processed_video_path}")
        print(f"   Keypoints CSV:    {keypoints_csv}")
        print(f"   Visualization:    {viz_path}")
        print(f"   JSON Report:      {report_path}")
        print("\n" + "="*70 + "\n")
        
        return results


def main():
    """Command-line interface"""
    parser = argparse.ArgumentParser(
        description='Analyze bowling video end-to-end'
    )
    parser.add_argument(
        'video',
        type=str,
        help='Path to video file (e.g., data/raw_videos/front_view/bowler_001.mp4)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='results',
        help='Output directory (default: results/)'
    )
    
    args = parser.parse_args()
    
    # Run analysis
    analyzer = BowlingVideoAnalyzer(output_dir=args.output)
    
    try:
        results = analyzer.analyze(args.video)
        
        # Exit code based on success
        if all(step.get('status') == 'success' 
               for step in results['pipeline_steps'].values()):
            sys.exit(0)
        else:
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
