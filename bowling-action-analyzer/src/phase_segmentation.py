"""
Pure Order-Based Peak Segmentation
===================================

Strategy:
    1. Find ALL peaks in entire video (no percentage bounds)
    2. Use ONLY temporal ordering to identify phases:
       - First significant hip peak = Jump
       - Highest hip peak after jump = BFC
       - First ankle valley after BFC = FFC  
       - Highest wrist peak after FFC = Release
    
    NO assumptions about video percentages!

Author: Teammate A - CV & Segmentation
Last Modified: Nov 16, 2025
"""

import numpy as np
from scipy.signal import find_peaks, savgol_filter
from src.feature_engineering import FeatureExtractor


class OrderBasedSegmentor:
    """Phase segmentation using pure temporal ordering"""
    
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
    
    def smooth(self, signal, window_ratio=0.05):
        """Adaptive smoothing based on signal length"""
        n = len(signal)
        window = max(5, int(n * window_ratio))
        window = window if window % 2 == 1 else window + 1
        
        if window >= n:
            return signal
        return savgol_filter(signal, window_length=window, polyorder=2)
    
    def detect_all_peaks_global(self, features):
        """
        Find ALL peaks in entire video without any positional constraints
        """
        n = features['num_frames']
        
        # Smooth signals
        hip_smooth = self.smooth(features['hip_y'])
        wrist_smooth = self.smooth(features['wrist_speed'])
        ankle_smooth = self.smooth(np.abs(features['ankle_velocity']))
        
        peaks_dict = {}
        
        # 1. Hip peaks (for jump and BFC)
        hip_peaks, hip_props = find_peaks(
            hip_smooth,
            prominence=np.std(hip_smooth) * 0.10,  # Lower threshold to catch all
            distance=max(5, int(n * 0.02))  # Minimum gap between peaks
        )
        
        peaks_dict['hip_peaks'] = {
            'frames': hip_peaks,
            'heights': hip_smooth[hip_peaks],
            'prominences': hip_props['prominences']
        }
        
        # 2. Wrist peaks (for release)
        wrist_peaks, wrist_props = find_peaks(
            wrist_smooth,
            prominence=np.std(wrist_smooth) * 0.15,
            distance=max(5, int(n * 0.02))
        )
        
        peaks_dict['wrist_peaks'] = {
            'frames': wrist_peaks,
            'heights': wrist_smooth[wrist_peaks],
            'prominences': wrist_props['prominences']
        }
        
        # 3. Ankle valleys (for FFC - stationary foot)
        ankle_inverted = -ankle_smooth
        ankle_valleys, ankle_props = find_peaks(
            ankle_inverted,
            prominence=np.std(ankle_smooth) * 0.10,
            distance=max(5, int(n * 0.02))
        )
        
        peaks_dict['ankle_valleys'] = {
            'frames': ankle_valleys,
            'depths': ankle_smooth[ankle_valleys],
            'prominences': ankle_props['prominences']
        }
        
        return peaks_dict
    
    def select_by_order(self, peaks_dict, n_frames):
        """
        Select events using ONLY temporal ordering rules:
        
        1. Jump = First significant hip peak
        2. BFC = Highest hip peak AFTER jump
        3. FFC = First ankle valley AFTER BFC (lowest velocity)
        4. Release = Highest wrist peak AFTER FFC
        
        NO percentage constraints!
        """
        events = {}
        
        # === JUMP: First significant hip peak ===
        if len(peaks_dict['hip_peaks']['frames']) > 0:
            # Sort by prominence (quality of peak)
            hip_peaks_sorted = sorted(
                zip(peaks_dict['hip_peaks']['frames'], 
                    peaks_dict['hip_peaks']['prominences']),
                key=lambda x: x[1],
                reverse=True
            )
            
            # Take most prominent peak in first half of video as jump
            # (but don't enforce percentage - just use first half as heuristic)
            early_peaks = [p for p in hip_peaks_sorted if p[0] < n_frames * 0.5]
            
            if early_peaks:
                events['jump'] = int(early_peaks[0][0])
            else:
                # Fallback: earliest peak
                events['jump'] = int(min(peaks_dict['hip_peaks']['frames']))
        else:
            events['jump'] = int(n_frames * 0.25)  # Emergency fallback
        
        # === BFC: Highest hip peak AFTER jump ===
        if len(peaks_dict['hip_peaks']['frames']) > 0:
            # Get all hip peaks after jump
            peaks_after_jump = [
                (frame, height) 
                for frame, height in zip(peaks_dict['hip_peaks']['frames'], 
                                        peaks_dict['hip_peaks']['heights'])
                if frame > events['jump']
            ]
            
            if peaks_after_jump:
                # Select highest peak (apex of jump)
                events['bfc'] = int(max(peaks_after_jump, key=lambda x: x[1])[0])
            else:
                # No peak after jump - estimate
                events['bfc'] = int(events['jump'] + max(10, n_frames * 0.08))
        else:
            events['bfc'] = int(events['jump'] + max(10, n_frames * 0.08))
        
        # === FFC: First ankle valley AFTER BFC (most stationary) ===
        if len(peaks_dict['ankle_valleys']['frames']) > 0:
            # Get all valleys after BFC
            valleys_after_bfc = [
                (frame, depth) 
                for frame, depth in zip(peaks_dict['ankle_valleys']['frames'],
                                       peaks_dict['ankle_valleys']['depths'])
                if frame > events['bfc']
            ]
            
            if valleys_after_bfc:
                # Select valley with lowest velocity (most stationary)
                events['ffc'] = int(min(valleys_after_bfc, key=lambda x: x[1])[0])
            else:
                # No valley found - estimate
                events['ffc'] = int(events['bfc'] + max(15, n_frames * 0.12))
        else:
            events['ffc'] = int(events['bfc'] + max(15, n_frames * 0.12))
        
        # === RELEASE: Highest wrist peak AFTER FFC ===
        if len(peaks_dict['wrist_peaks']['frames']) > 0:
            # Get all wrist peaks after FFC
            peaks_after_ffc = [
                (frame, height)
                for frame, height in zip(peaks_dict['wrist_peaks']['frames'],
                                        peaks_dict['wrist_peaks']['heights'])
                if frame > events['ffc']
            ]
            
            if peaks_after_ffc:
                # Select highest wrist speed peak
                events['release'] = int(max(peaks_after_ffc, key=lambda x: x[1])[0])
            else:
                # No peak after FFC - estimate
                events['release'] = int(events['ffc'] + max(8, n_frames * 0.06))
        else:
            events['release'] = int(events['ffc'] + max(8, n_frames * 0.06))
        
        return events
    
    def validate_minimal_gaps(self, events, n_frames):
        """
        Only enforce MINIMUM realistic gaps (to prevent obvious errors)
        No maximum constraints!
        """
        min_gap_frames = max(3, int(n_frames * 0.02))  # At least 2% of video
        
        # Ensure minimum gaps
        if events['bfc'] < events['jump'] + min_gap_frames:
            events['bfc'] = events['jump'] + min_gap_frames
        
        if events['ffc'] < events['bfc'] + min_gap_frames:
            events['ffc'] = events['bfc'] + min_gap_frames
        
        if events['release'] < events['ffc'] + min_gap_frames:
            events['release'] = events['ffc'] + min_gap_frames
        
        # Ensure within bounds
        events['release'] = min(events['release'], n_frames - 2)
        events['ffc'] = min(events['ffc'], events['release'] - min_gap_frames)
        events['bfc'] = min(events['bfc'], events['ffc'] - min_gap_frames)
        events['jump'] = min(events['jump'], events['bfc'] - min_gap_frames)
        
        return events
    
    def segment(self, keypoints_csv):
        """
        Main pipeline: Global peak detection → Order-based selection
        """
        # Extract features
        features = self.feature_extractor.extract_all_features(keypoints_csv)
        n_frames = features['num_frames']
        
        print(f"  Video length: {n_frames} frames")
        
        # Step 1: Detect ALL peaks globally (no position constraints)
        print(f"  Detecting all peaks globally...")
        peaks_dict = self.detect_all_peaks_global(features)
        
        print(f"    Hip peaks: {len(peaks_dict['hip_peaks']['frames'])}")
        print(f"    Wrist peaks: {len(peaks_dict['wrist_peaks']['frames'])}")
        print(f"    Ankle valleys: {len(peaks_dict['ankle_valleys']['frames'])}")
        
        # Step 2: Select events using only temporal ordering
        print(f"  Selecting events by order...")
        events = self.select_by_order(peaks_dict, n_frames)
        
        # Step 3: Minimal validation (only prevent overlaps)
        events = self.validate_minimal_gaps(events, n_frames)
        
        print(f"    Jump: {events['jump']}")
        print(f"    BFC: {events['bfc']}")
        print(f"    FFC: {events['ffc']}")
        print(f"    Release: {events['release']}")
        
        # Package results
        final_events = {
            'jump_frame': int(events['jump']),
            'back_foot_contact_frame': int(events['bfc']),
            'front_foot_contact_frame': int(events['ffc']),
            'ball_release_frame': int(events['release'])
        }
        
        phases = {
            'run_up': (0, final_events['jump_frame']),
            'jump_phase': (final_events['jump_frame'], final_events['back_foot_contact_frame']),
            'delivery_stride': (final_events['back_foot_contact_frame'], final_events['front_foot_contact_frame']),
            'release_phase': (final_events['front_foot_contact_frame'], final_events['ball_release_frame']),
            'follow_through': (final_events['ball_release_frame'], n_frames)
        }
        
        key_angles = {
            'elbow_at_release': float(features['elbow_angle'][final_events['ball_release_frame']]),
            'knee_at_ffc': float(features['knee_angle'][final_events['front_foot_contact_frame']]),
            'knee_at_bfc': float(features['knee_angle'][final_events['back_foot_contact_frame']])
        }
        
        durations = {
            'jump_to_bfc': final_events['back_foot_contact_frame'] - final_events['jump_frame'],
            'bfc_to_ffc': final_events['front_foot_contact_frame'] - final_events['back_foot_contact_frame'],
            'ffc_to_release': final_events['ball_release_frame'] - final_events['front_foot_contact_frame']
        }
        
        return {
            'events': final_events,
            'phases': phases,
            'key_angles': key_angles,
            'durations': durations,
            'features': features
        }
