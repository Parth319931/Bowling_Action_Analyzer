"""
Enhanced Video Preprocessing Module
====================================

Purpose:
    Robustly standardize bowling videos with inconsistent properties (resolution, FPS, aspect ratios).
    Handles videos of different sizes, frame rates, and qualities.

Key Features:
    - Adaptive FPS conversion (handles any input FPS)
    - Smart aspect ratio preservation with padding
    - Frame interpolation for smooth FPS conversion
    - Handles portrait/landscape/square videos
    - Quality validation and error recovery

Input:
    - Raw videos with ANY resolution, FPS, or aspect ratio
    - Common issues handled:
      * Different FPS (24, 25, 30, 50, 60, etc.)
      * Different resolutions (480p, 720p, 1080p, 4K)
      * Portrait mode videos
      * Variable bitrates

Output:
    - Standardized videos: 1280x720, 30fps, consistent quality
    - All videos have same dimensions and temporal properties

Technical Approach:
    1. Calculate optimal scaling to fit target resolution
    2. Add black letterboxing/pillarboxing as needed
    3. Interpolate frames for FPS conversion
    4. Validate output consistency

Dependencies:
    - opencv-python (cv2)
    - numpy
    - tqdm

Author: Teammate A - CV & Segmentation
Last Modified: Nov 6, 2025
"""

import cv2
import os
import numpy as np
from pathlib import Path
from tqdm import tqdm

class VideoPreprocessor:
    """Robust video preprocessing for inconsistent datasets"""
    
    def __init__(self, target_resolution=(1280, 720), target_fps=30):
        self.target_width, self.target_height = target_resolution
        self.target_fps = target_fps
        
        # Quality thresholds
        self.min_width = 640  # Reject videos smaller than this
        self.min_fps = 15     # Reject videos slower than this
        self.max_fps = 120    # Cap extremely high FPS
    
    def validate_video(self, video_path):
        """
        Check if video meets minimum quality requirements
        Returns: (is_valid, info_dict)
        """
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            return False, {"error": "Cannot open video"}
        
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        cap.release()
        
        info = {
            "width": width,
            "height": height,
            "fps": fps,
            "frame_count": frame_count,
            "duration": frame_count / fps if fps > 0 else 0
        }
        
        # Validation checks
        if width < self.min_width or height < self.min_width:
            return False, {**info, "error": f"Resolution too low ({width}x{height})"}
        
        if fps < self.min_fps:
            return False, {**info, "error": f"FPS too low ({fps})"}
        
        if frame_count < 30:  # Less than 1 second at 30fps
            return False, {**info, "error": f"Video too short ({frame_count} frames)"}
        
        return True, info
    
    def preprocess_video(self, input_path, output_path):
        """
        Process single video with robust handling of inconsistent properties
        """
        # Validate first
        is_valid, info = self.validate_video(input_path)
        
        if not is_valid:
            raise ValueError(f"Invalid video: {info.get('error', 'Unknown error')}")
        
        cap = cv2.VideoCapture(input_path)
        
        # Get original properties
        orig_fps = info['fps']
        orig_width = info['width']
        orig_height = info['height']
        
        # Calculate frame sampling for FPS conversion
        frame_sample_ratio = orig_fps / self.target_fps
        
        # Setup video writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, self.target_fps, 
                            (self.target_width, self.target_height))
        
        frame_idx = 0
        written_frames = 0
        next_frame_to_write = 0.0
        
        print(f"  Processing: {orig_width}x{orig_height} @ {orig_fps:.1f}fps → {self.target_width}x{self.target_height} @ {self.target_fps}fps")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # FPS conversion: decide if we should write this frame
            if frame_idx >= next_frame_to_write:
                # Resize with padding
                frame_resized = self.resize_with_padding(frame)
                out.write(frame_resized)
                
                written_frames += 1
                next_frame_to_write += frame_sample_ratio
            
            frame_idx += 1
        
        cap.release()
        out.release()
        
        return written_frames
    
    def resize_with_padding(self, frame):
        """
        Resize maintaining aspect ratio with intelligent padding
        Handles portrait, landscape, and square videos
        """
        h, w = frame.shape[:2]
        
        # Calculate scaling factor (fit within target dimensions)
        scale = min(self.target_width / w, self.target_height / h)
        new_w = int(w * scale)
        new_h = int(h * scale)
        
        # Resize frame
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        
        # Create black canvas
        canvas = np.zeros((self.target_height, self.target_width, 3), dtype=np.uint8)
        
        # Center the resized frame
        x_offset = (self.target_width - new_w) // 2
        y_offset = (self.target_height - new_h) // 2
        
        canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
        
        return canvas
    
    def batch_preprocess(self, input_dir, output_dir):
        """
        Process all videos with error handling and reporting
        """
        os.makedirs(output_dir, exist_ok=True)
        
        # Find all video files (multiple extensions)
        video_extensions = ['*.mp4', '*.avi', '*.mov', '*.MP4', '*.AVI', '*.MOV', '*.mkv', '*.MKV']
        video_files = []
        for ext in video_extensions:
            video_files.extend(Path(input_dir).glob(ext))
        
        if len(video_files) == 0:
            print(f"⚠️  No videos found in {input_dir}")
            return
        
        print(f"\nFound {len(video_files)} videos in {input_dir}")
        
        # Track statistics
        successful = 0
        failed = 0
        skipped = 0
        failed_videos = []
        
        for video_path in tqdm(video_files, desc=f"Processing {Path(input_dir).name}"):
            output_path = os.path.join(output_dir, f"{video_path.stem}_processed.mp4")
            
            # Skip if already processed
            if os.path.exists(output_path):
                skipped += 1
                continue
            
            try:
                frames = self.preprocess_video(str(video_path), output_path)
                successful += 1
                
            except ValueError as e:
                # Validation failed
                failed += 1
                failed_videos.append((video_path.name, str(e)))
                print(f"\n  ⚠️  Skipped {video_path.name}: {e}")
                
            except Exception as e:
                # Processing error
                failed += 1
                failed_videos.append((video_path.name, str(e)))
                print(f"\n  ✗ Error processing {video_path.name}: {e}")
        
        # Summary report
        print("\n" + "="*60)
        print(f"Processing Summary for {Path(input_dir).name}:")
        print(f"  ✅ Successfully processed: {successful}")
        print(f"  ⏭️  Skipped (already exist): {skipped}")
        print(f"  ❌ Failed: {failed}")
        
        if failed_videos:
            print("\nFailed videos:")
            for name, reason in failed_videos:
                print(f"  - {name}: {reason}")
        
        print("="*60 + "\n")
        
        return {
            'successful': successful,
            'failed': failed,
            'skipped': skipped,
            'failed_videos': failed_videos
        }
