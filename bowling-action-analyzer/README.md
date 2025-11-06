# Bowling Action Analyzer

## Overview
The Bowling Action Analyzer is a project designed to analyze and evaluate bowling actions using machine learning techniques. It processes raw data, extracts features, trains models, and provides visualizations and insights into bowling performance.

## Project Structure
```
bowling-action-analyzer
├── data
│   ├── raw
│   ├── processed
│   └── external
├── src
│   ├── __init__.py
│   ├── main.py
│   ├── preprocessing.py
│   ├── features.py
│   ├── visualization.py
│   ├── inference.py
│   ├── models
│   │   └── model.py
│   └── utils
│       └── helpers.py
├── models
│   ├── checkpoints
│   └── exports
├── notebooks
│   ├── 01-eda.ipynb
│   └── 02-model-experiments.ipynb
├── scripts
│   ├── run_training.sh
│   ├── evaluate.sh
│   └── collect_data.py
├── results
│   ├── figures
│   └── metrics
├── web
│   ├── app.py
│   ├── templates
│   │   └── index.html
│   └── static
│       ├── css
│       └── js
├── requirements.txt
├── environment.yml
├── .gitignore
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd bowling-action-analyzer
   ```

2. Create a conda environment using the provided `environment.yml`:
   ```
   conda env create -f environment.yml
   conda activate bowling-action-analyzer
   ```

3. Install additional dependencies if needed:
   ```
   pip install -r requirements.txt
   ```

## Usage Guidelines
- To run the main application, execute:
  ```
  python src/main.py
  ```

- For data collection, use the script:
  ```
  python scripts/collect_data.py
  ```

- To train the model, run:
  ```
  bash scripts/run_training.sh
  ```

- For evaluation, execute:
  ```
  bash scripts/evaluate.sh
  ```

## Notebooks
Explore the Jupyter notebooks in the `notebooks` directory for exploratory data analysis and model experimentation.

## Results
Generated figures and metrics can be found in the `results` directory.

## Web Interface
The web interface can be accessed by running the Flask application in the `web` directory.