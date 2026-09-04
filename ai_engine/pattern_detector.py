import cv2
import numpy as np

def detect_clothing_pattern(image_path):
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return "solid"

        img = cv2.resize(img, (200, 200))
        edges = cv2.Canny(img, 50, 150)
        edge_density = np.sum(edges > 0) / (200 * 200)

        # Fast Fourier Transform for periodicity (stripes vs checks vs solids)
        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1)
        fft_std = np.std(magnitude_spectrum)

        if edge_density < 0.05:
            return "solid"
        elif fft_std > 28.0:
            return "striped"
        elif edge_density > 0.15:
            return "floral"
        elif edge_density > 0.09:
            return "plaid"
        else:
            return "solid"
    except Exception as e:
        print(f"[PatternDetector Error] {e}")
        return "solid"
