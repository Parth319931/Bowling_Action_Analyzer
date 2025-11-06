# collect_data.py

import os
import pandas as pd

def collect_raw_data(data_directory):
    raw_data_path = os.path.join(data_directory, 'raw')
    data_files = [f for f in os.listdir(raw_data_path) if f.endswith('.csv')]
    data_frames = []

    for file in data_files:
        file_path = os.path.join(raw_data_path, file)
        df = pd.read_csv(file_path)
        data_frames.append(df)

    return pd.concat(data_frames, ignore_index=True)

def process_data(df):
    # Placeholder for data processing logic
    processed_df = df.dropna()  # Example: drop missing values
    return processed_df

def save_processed_data(df, data_directory):
    processed_data_path = os.path.join(data_directory, 'processed', 'processed_data.csv')
    df.to_csv(processed_data_path, index=False)

if __name__ == "__main__":
    data_directory = '../data'  # Adjust path as necessary
    raw_data = collect_raw_data(data_directory)
    processed_data = process_data(raw_data)
    save_processed_data(processed_data, data_directory)