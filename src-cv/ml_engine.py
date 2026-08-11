import numpy as np
from fastdtw import fastdtw
from scipy.spatial.distance import euclidean
import pickle
import os

class GestureRecognizer:
    def __init__(self, dtw_threshold=15.0, templates_file="templates.pkl"):
        # templates maps a gesture_name (str) -> list of normalized frames (list of 63-dim lists)
        self.templates = {}
        self.dtw_threshold = dtw_threshold
        self.templates_file = templates_file
        self.load_templates()

    def load_templates(self):
        if os.path.exists(self.templates_file):
            try:
                with open(self.templates_file, "rb") as f:
                    self.templates = pickle.load(f)
                print(f"[DTW] Loaded {len(self.templates)} gestures from {self.templates_file}")
            except Exception as e:
                print(f"[DTW] Error loading templates: {e}")

    def save_templates(self):
        try:
            with open(self.templates_file, "wb") as f:
                pickle.dump(self.templates, f)
            print(f"[DTW] Saved templates to {self.templates_file}")
        except Exception as e:
            print(f"[DTW] Error saving templates: {e}")

    def delete_template(self, gesture_name):
        if gesture_name in self.templates:
            del self.templates[gesture_name]
            self.save_templates()
            print(f"[DTW] Deleted template for '{gesture_name}'")
            return True
        return False

    def add_template(self, gesture_name, frame_sequence):
        """
        Adds a new gesture template.
        `frame_sequence` should be a temporal list of normalized 63-dim landmark vectors.
        """
        if len(frame_sequence) < 5:
            print(f"[DTW] Sequence too short for {gesture_name}. Ignoring.")
            return False
            
        if gesture_name not in self.templates:
            self.templates[gesture_name] = []
            
        self.templates[gesture_name].append(np.array(frame_sequence))
        self.save_templates()
        print(f"[DTW] Added template for '{gesture_name}'. Total samples: {len(self.templates[gesture_name])}")
        return True

    def recognize(self, live_sequence):
        """
        Compares a live sequence (window of frames) against all saved templates.
        Returns the best matching gesture name and the distance score.
        """
        if not self.templates or len(live_sequence) < 5:
            return None, float('inf')

        live_seq = np.array(live_sequence)
        
        best_match = None
        best_distance = float('inf')

        for gesture_name, samples in self.templates.items():
            for template in samples:
                # Calculate DTW distance
                distance, path = fastdtw(live_seq, template, dist=euclidean)
                
                # Normalize distance by sequence length
                normalized_distance = distance / len(live_seq)
                
                if normalized_distance < best_distance:
                    best_distance = normalized_distance
                    best_match = gesture_name

        if best_distance < self.dtw_threshold:
            return best_match, best_distance
        
        return None, best_distance
