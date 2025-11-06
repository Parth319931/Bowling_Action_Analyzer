#!/bin/bash

# This script evaluates the trained model on the test dataset.

# Set variables
MODEL_PATH="models/exports/best_model.h5"
TEST_DATA_PATH="data/processed/test_data.csv"
RESULTS_PATH="results/metrics/evaluation_results.txt"

# Activate the conda environment
source activate bowling-action-analyzer

# Run the evaluation script
python src/inference.py --model_path $MODEL_PATH --test_data_path $TEST_DATA_PATH --results_path $RESULTS_PATH

echo "Evaluation completed. Results saved to $RESULTS_PATH."