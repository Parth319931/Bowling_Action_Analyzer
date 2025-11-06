#!/bin/bash

# Activate the conda environment
conda activate bowling-action-analyzer

# Run the training script
python src/main.py --mode train --config config/train_config.yaml

# Deactivate the conda environment
conda deactivate