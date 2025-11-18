"""
Phase Segmentation Visualization Module (4 Events)
===================================================

Purpose:
    Visualize 4-event phase segmentation results.

Author: Teammate A - CV & Segmentation
Last Modified: Nov 7, 2025
"""

import matplotlib.pyplot as plt
import numpy as np
import os

class PhaseVisualizer:
    """Visualize 4-event phase segmentation results"""
    
    def plot_results(self, result, save_path):
        """
        Create 3-panel visualization with 4 event markers
        """
        features = result['features']
        events = result['events']
        phases = result['phases']
        
        frames = np.arange(features['num_frames'])
        
        fig, axes = plt.subplots(3, 1, figsize=(16, 11))
        
        # === PLOT 1: Wrist Speed ===
        axes[0].plot(frames, features['wrist_speed'], 'b-', linewidth=2, label='Wrist Speed')
        axes[0].axvline(events['ball_release_frame'], color='red', linestyle='-', 
                       linewidth=2.5, label='Ball Release', alpha=0.8)
        axes[0].axvline(events['front_foot_contact_frame'], color='purple', linestyle='--', 
                       linewidth=1.5, label='Front-Foot Contact', alpha=0.7)
        axes[0].set_title('Wrist Speed (Ball Release Detection)', fontsize=14, fontweight='bold')
        axes[0].set_ylabel('Speed (normalized)', fontsize=11)
        axes[0].legend(fontsize=9, loc='upper right')
        axes[0].grid(True, alpha=0.3)
        
        # === PLOT 2: Hip Position ===
        axes[1].plot(frames, features['hip_y'], 'g-', linewidth=2, label='Hip Y Position')
        axes[1].axvline(events['jump_frame'], color='orange', linestyle='-', 
                       linewidth=2.5, label='Jump Takeoff', alpha=0.8)
        axes[1].axvline(events['back_foot_contact_frame'], color='brown', linestyle='--', 
                       linewidth=2, label='Back-Foot Contact', alpha=0.7)
        axes[1].axvline(events['front_foot_contact_frame'], color='purple', linestyle='--', 
                       linewidth=1.5, label='Front-Foot Contact', alpha=0.7)
        axes[1].set_title('Hip Vertical Trajectory (Jump & Stride Detection)', fontsize=14, fontweight='bold')
        axes[1].set_ylabel('Y Position (normalized)', fontsize=11)
        axes[1].legend(fontsize=9, loc='upper right')
        axes[1].grid(True, alpha=0.3)
        
        # === PLOT 3: Phase Timeline ===
        phase_map = {
            'run_up': 0,
            'jump_phase': 1,
            'delivery_stride': 2,
            'release_phase': 3,
            'follow_through': 4
        }
        
        timeline = np.zeros(features['num_frames'])
        for phase_name, (start, end) in phases.items():
            timeline[start:end] = phase_map[phase_name]
        
        axes[2].plot(frames, timeline, linewidth=8, color='steelblue')
        
        # Add event markers
        axes[2].axvline(events['jump_frame'], color='orange', linestyle='-', linewidth=2, alpha=0.6)
        axes[2].axvline(events['back_foot_contact_frame'], color='brown', linestyle='-', linewidth=2, alpha=0.6)
        axes[2].axvline(events['front_foot_contact_frame'], color='purple', linestyle='-', linewidth=2, alpha=0.6)
        axes[2].axvline(events['ball_release_frame'], color='red', linestyle='-', linewidth=2, alpha=0.6)
        
        axes[2].set_title('Phase Segmentation Timeline (5 Phases, 4 Events)', fontsize=14, fontweight='bold')
        axes[2].set_xlabel('Frame Number', fontsize=11)
        axes[2].set_ylabel('Phase', fontsize=11)
        axes[2].set_yticks([0, 1, 2, 3, 4])
        axes[2].set_yticklabels(['Run-up', 'Jump', 'Delivery\nStride', 'Release', 'Follow-through'])
        axes[2].grid(True, alpha=0.3, axis='x')
        
        # Add duration annotations
        for phase_name, (start, end) in phases.items():
            duration = end - start
            mid_point = (start + end) / 2
            axes[2].text(mid_point, phase_map[phase_name], 
                        f'{duration}f', 
                        ha='center', va='center',
                        fontsize=8, fontweight='bold',
                        bbox=dict(boxstyle='round', facecolor='white', alpha=0.9, edgecolor='gray'))
        
        plt.tight_layout()
        
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        plt.close()
