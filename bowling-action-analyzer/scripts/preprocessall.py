"""
Batch Video Preprocessing Script (Enhanced)
============================================

Purpose:
    Robustly process all raw bowling videos with inconsistent properties.
    Generates detailed logs of processing results.

Features:
    - Handles videos of any resolution, FPS, aspect ratio
    - Validates quality before processing
    - Detailed error reporting
    - Processing statistics

Run:
    python scripts/preprocess_all.py

Output:
    - Processed videos in data/processed_videos/
    - Console report of successes/failures
    - Recommendations for failed videos

Author: Teammate A - CV & Segmentation
Last Modified: Nov 6, 2025
"""

import sys
sys.path.append('.')

from src.preprocess import VideoPreprocessor

if __name__ == '__main__':
    preprocessor = VideoPreprocessor(
        target_resolution=(1280, 720),
        target_fps=30
    )
    
    print("\n" + "="*60)
    print("📹 BATCH VIDEO PREPROCESSING")
    print("="*60)
    
    # Process front view
    print("\n🎬 Processing Front View Videos...")
    front_results = preprocessor.batch_preprocess(
        input_dir='data/raw_videos/front_view',
        output_dir='data/processed_videos/front_view'
    )
    
    # Process side view
    print("\n🎬 Processing Side View Videos...")
    side_results = preprocessor.batch_preprocess(
        input_dir='data/raw_videos/side_view',
        output_dir='data/processed_videos/side_view'
    )
    
    # Overall summary
    print("\n" + "="*60)
    print("📊 OVERALL SUMMARY")
    print("="*60)
    
    if front_results and side_results:
        total_success = front_results['successful'] + side_results['successful']
        total_failed = front_results['failed'] + side_results['failed']
        
        print(f"\nTotal successfully processed: {total_success}")
        print(f"Total failed: {total_failed}")
        
        if total_failed > 0:
            print("\n⚠️  Some videos failed processing.")
            print("Common causes:")
            print("  - Very low resolution (< 640px)")
            print("  - Very low FPS (< 15fps)")
            print("  - Corrupted video files")
            print("  - Very short duration (< 1 second)")
            print("\nRecommendation: Check failed videos or re-record if possible")
        else:
            print("\n✅ All videos processed successfully!")
    
    print("\n" + "="*60)
    print("\nNext step: Run 'python scripts/extract_all_poses.py'")
    print("="*60 + "\n")
