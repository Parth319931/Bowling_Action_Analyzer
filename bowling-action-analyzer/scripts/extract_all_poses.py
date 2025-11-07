import sys
sys.path.append('.')

from src.pose_extract import PoseExtractor

if __name__ == '__main__':
    extractor = PoseExtractor()
    
    print("\n🦴 Extracting poses from Front View...")
    extractor.batch_extract(
        video_dir='data/processed_videos/front_view',
        output_dir='data/keypoints/front_view'
    )
    
    print("\n🦴 Extracting poses from Side View...")
    extractor.batch_extract(
        video_dir='data/processed_videos/side_view',
        output_dir='data/keypoints/side_view'
    )
    
    print("\n✅ All poses extracted!")
