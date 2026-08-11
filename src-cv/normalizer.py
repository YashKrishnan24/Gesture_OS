import numpy as np

def normalize_landmarks(landmarks):
    """
    Normalizes a single frame of MediaPipe hand landmarks.
    Makes the coordinates translation and scale invariant.
    """
    if not landmarks:
        return []

    # Convert to numpy array for easier math (shape: [21, 3])
    pts = np.array([[lm.x, lm.y, lm.z] for lm in landmarks])

    # 1. Translation invariance: Set wrist (index 0) to origin (0, 0, 0)
    wrist = pts[0]
    pts = pts - wrist

    # 2. Scale invariance: Normalize by the maximum bounding box dimension
    max_val = np.max(np.abs(pts))
    if max_val > 0:
        pts = pts / max_val

    # Return flattened 1D array (63 dimensions) for DTW / distance metrics
    return pts.flatten().tolist()
