# Contents of /bowling-action-analyzer/bowling-action-analyzer/src/main.py

import sys
from preprocessing import preprocess_data
from features import extract_features
from inference import run_inference
from visualization import visualize_results

def main():
    # Step 1: Preprocess the data
    raw_data = preprocess_data('data/raw')
    
    # Step 2: Extract features
    features = extract_features(raw_data)
    
    # Step 3: Run inference
    results = run_inference(features)
    
    # Step 4: Visualize results
    visualize_results(results)

if __name__ == "__main__":
    main()