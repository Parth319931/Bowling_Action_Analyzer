import cv2
import os
import numpy as np
from pathlib import Path
from tqdm import tqdm

class VideoPreprocessor:
    """Standardize videos to 1280x720 at 30fps"""
    
    def __init__(self, target_resolution=(1280, 720), target_fps=30):
        self.target_width, self.target_height = target_resolution
        self.target_fps = target_fps
    
    def preprocess_video(self, input_path, output_path):
        """Process single video"""
        cap = cv2.VideoCapture(input_path)
        
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {input_path}")
        
        # Setup writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, self.target_fps, 
                            (self.target_width, self.target_height))
        
        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Resize with padding
            frame_resized = self.resize_with_padding(frame)
            out.write(frame_resized)
            frame_count += 1
        
        cap.release()
        out.release()
        
        return frame_count
    
    def resize_with_padding(self, frame):
        """Resize maintaining aspect ratio with black padding"""
        h, w = frame.shape[:2]
        
        # Calculate scale
        scale = min(self.target_width / w, self.target_height / h)
        new_w = int(w * scale)
        new_h = int(h * scale)
        
        # Resize
        resized = cv2.resize(frame, (new_w, new_h))
        
        # Create black canvas and center frame
        canvas = np.zeros((self.target_height, self.target_width, 3), dtype=np.uint8)
        x_offset = (self.target_width - new_w) // 2
        y_offset = (self.target_height - new_h) // 2
        canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
        
        return canvas
    
    def batch_preprocess(self, input_dir, output_dir):
        """Process all videos in directory"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Find all video files
        video_extensions = ['*.mp4', '*.avi', '*.mov', '*.MP4', '*.AVI']
        video_files = []
        for ext in video_extensions:
            video_files.extend(Path(input_dir).glob(ext))
        
        if len(video_files) == 0:
            print(f"⚠️  No videos found in {input_dir}")
            return
        
        print(f"Found {len(video_files)} videos in {input_dir}")
        
        for video_path in tqdm(video_files, desc=f"Processing {Path(input_dir).name}"):
            output_path = os.path.join(output_dir, f"{video_path.stem}_processed.mp4")
            
            if os.path.exists(output_path):
                continue
            
            try:
                frames = self.preprocess_video(str(video_path), output_path)
                # print(f"  ✓ {video_path.name}: {frames} frames")
            except Exception as e:
                print(f"  ✗ Error on {video_path.name}: {e}")
