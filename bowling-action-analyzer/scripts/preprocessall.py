import sys
sys.path.append('.')

from src.preprocess import VideoPreprocessor

if __name__ == '__main__':
    preprocessor = VideoPreprocessor()
    
    print("\n📹 Processing Front View Videos...")
    preprocessor.batch_preprocess(
        input_dir='data/raw_videos/front_view',
        output_dir='data/processed_videos/front_view'
    )
    
    print("\n📹 Processing Side View Videos...")
    preprocessor.batch_preprocess(
        input_dir='data/raw_videos/side_view',
        output_dir='data/processed_videos/side_view'
    )
    
    print("\n✅ All videos preprocessed!")
