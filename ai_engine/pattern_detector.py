import cv2
import numpy as np

def detect_clothing_pattern(image_path):
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return "solid"

        img = cv2.resize(img, (200, 200))
        blurred = cv2.GaussianBlur(img, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)
        edge_density = np.mean(edges > 0)

        # Repeated directional edges are a better stripe/check signal than a
        # global FFT threshold, which is easily triggered by photo backgrounds.
        horizontal_edges = np.mean(np.abs(cv2.Sobel(blurred, cv2.CV_32F, 1, 0)))
        vertical_edges = np.mean(np.abs(cv2.Sobel(blurred, cv2.CV_32F, 0, 1)))
        direction_ratio = max(horizontal_edges, vertical_edges) / max(min(horizontal_edges, vertical_edges), 1)
        texture = cv2.Laplacian(blurred, cv2.CV_32F).var()

        if edge_density < 0.035 and texture < 180:
            return "solid"
        elif direction_ratio > 1.8:
            return "striped"
        elif edge_density > 0.12 and texture > 500:
            return "floral"
        elif edge_density > 0.07:
            return "plaid"
        else:
            return "solid"
    except Exception as e:
        print(f"[PatternDetector Error] {e}")
        return "solid"
