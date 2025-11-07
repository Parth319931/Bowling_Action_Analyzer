"""
Phase Segmentation Visualization Module
========================================

Purpose:
    Create plots showing detected phases and key signals.
    Visual validation of phase segmentation quality.

Plots Generated:
    1. Wrist Speed with Ball Release marker
    2. Hip Vertical Position with Jump and FFC markers
    3. Phase Timeline showing all phase boundaries

Features:
    - Clear visual separation of phases
    - Event markers (vertical lines)
    - Color-coded phases
    - Publication-quality figures

Input:
    - Segmentation result dictionary

Output:
    - PNG figure with 3 subplots
    - Saved to results/visualizations/

Usage:
    from src.visualization import PhaseVisualizer
    visualizer = PhaseVisualizer()
    visualizer.plot_results(result, 'output.png')

Use Cases:
    - Day 1: Verify segmentation works
    - Day 2: Tune thresholds based on visual inspection
    - Demo: Show system capabilities
    - Documentation: Include in report

Dependencies:
    - matplotlib
    - numpy

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import matplotlib.pyplot as plt
import numpy as np
import os

class PhaseVisualizer:
    """Visualize phase segmentation results"""
    
    def __init__(self):
        # Color scheme
        self.phase_colors = {
            'run_up': '#2ecc71',           # Green
            'delivery_stride': '#f39c12',  # Orange
            'release_phase': '#e74c3c',    # Red
            'follow_through': '#3498db'    # Blue
        }
    
    def plot_results(self, result, save_path):
        """
        Create 3-panel visualization:
        1. Wrist speed with release
        2. Hip position with jump and FFC
        3. Phase timeline
        """
        features = result['features']
        events = result['events']
        phases = result['phases']
        
        frames = np.arange(features['num_frames'])
        
        # Create figure with 3 subplots
        fig, axes = plt.subplots(3, 1, figsize=(15, 10))
        
        # Plot 1: Wrist Speed
        axes[0].plot(frames, features['wrist_speed'], 'b-', linewidth=2, label='Wrist Speed')
        axes[0].axvline(events['ball_release_frame'], color='r', linestyle='--', 
                       linewidth=2, label='Ball Release')
        axes[0].set_title('Wrist Speed Over Time (Ball Release Detection)', 
                         fontsize=14, fontweight='bold')
        axes[0].set_ylabel('Speed (normalized)', fontsize=12)
        axes[0].legend(fontsize=10, loc='upper right')
        axes[0].grid(True, alpha=0.3)
        
        # Plot 2: Hip Position
        axes[1].plot(frames, features['hip_y'], 'g-', linewidth=2, label='Hip Y Position')
        axes[1].axvline(events['jump_frame'], color='orange', linestyle='--', 
                       linewidth=2, label='Jump/Back-foot')
        axes[1].axvline(events['front_foot_contact_frame'], color='purple', 
                       linestyle='--', linewidth=2, label='Front-foot Contact')
        axes[1].set_title('Hip Vertical Trajectory (Jump & Stride Detection)', 
                         fontsize=14, fontweight='bold')
        axes[1].set_ylabel('Y Position (normalized)', fontsize=12)
        axes[1].legend(fontsize=10, loc='upper right')
        axes[1].grid(True, alpha=0.3)
        
        # Plot 3: Phase Timeline
        phase_map = {
            'run_up': 0,
            'delivery_stride': 1,
            'release_phase': 2,
            'follow_through': 3
        }
        
        timeline = np.zeros(features['num_frames'])
        for phase_name, (start, end) in phases.items():
            timeline[start:end] = phase_map[phase_name]
        
        axes[2].plot(frames, timeline, linewidth=8, color='steelblue')
        axes[2].set_title('Phase Segmentation Timeline', 
                         fontsize=14, fontweight='bold')
        axes[2].set_xlabel('Frame Number', fontsize=12)
        axes[2].set_ylabel('Phase', fontsize=12)
        axes[2].set_yticks([0, 1, 2, 3])
        axes[2].set_yticklabels(['Run-up', 'Delivery\nStride', 'Release', 'Follow-through'])
        axes[2].grid(True, alpha=0.3, axis='x')
        
        # Add phase duration annotations
        for phase_name, (start, end) in phases.items():
            duration = end - start
            mid_point = (start + end) / 2
            axes[2].text(mid_point, phase_map[phase_name], 
                        f'{duration}f', 
                        ha='center', va='center',
                        fontsize=9, fontweight='bold',
                        bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
        
        plt.tight_layout()
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        plt.close()
        print(f"✅  Visualization saved to {save_path}")
