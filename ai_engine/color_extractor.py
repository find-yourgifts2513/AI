import cv2
import numpy as np
from sklearn.cluster import KMeans

COLOR_PALETTE = [
    {"name": "Navy Blue", "hex": "#1B263B", "rgb": (27, 38, 59)},
    {"name": "Sky Blue", "hex": "#87CEEB", "rgb": (135, 206, 235)},
    {"name": "Royal Blue", "hex": "#4169E1", "rgb": (65, 105, 225)},
    {"name": "Classic Black", "hex": "#111111", "rgb": (17, 17, 17)},
    {"name": "Pure White", "hex": "#FAFAFA", "rgb": (250, 250, 250)},
    {"name": "Heather Grey", "hex": "#888888", "rgb": (136, 136, 136)},
    {"name": "Crimson Red", "hex": "#DC143C", "rgb": (220, 20, 60)},
    {"name": "Olive Green", "hex": "#556B2F", "rgb": (85, 107, 47)},
    {"name": "Emerald Green", "hex": "#50C878", "rgb": (80, 200, 120)},
    {"name": "Mustard Yellow", "hex": "#FFDB58", "rgb": (255, 219, 88)},
    {"name": "Beige / Tan", "hex": "#F5F5DC", "rgb": (245, 245, 220)},
    {"name": "Blush Pink", "hex": "#FFB6C1", "rgb": (255, 182, 193)},
    {"name": "Burgundy", "hex": "#800020", "rgb": (128, 0, 32)},
    {"name": "Lavender", "hex": "#E6E6FA", "rgb": (230, 230, 250)},
    {"name": "Gold Metallic", "hex": "#FFD700", "rgb": (255, 215, 0)}
]

def extract_dominant_colors(image_path, k=3):
    try:
        image = cv2.imread(image_path)
        if image is None:
            return [COLOR_PALETTE[0]]
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (150, 150))
        pixels = image.reshape((-1, 3))
        
        # Filter background white/grey noise
        filtered_pixels = [p for p in pixels if not (p[0] > 240 and p[1] > 240 and p[2] > 240)]
        if len(filtered_pixels) < 100:
            filtered_pixels = pixels

        kmeans = KMeans(n_clusters=k, random_state=42, n_init=5)
        kmeans.fit(filtered_pixels)
        
        centers = kmeans.cluster_centers_.astype(int)
        counts = np.bincount(kmeans.labels_)
        sorted_indices = np.argsort(counts)[::-1]

        extracted = []
        for idx in sorted_indices:
            rgb = centers[idx]
            closest_color = get_closest_color_name(rgb)
            if closest_color not in extracted:
                extracted.append(closest_color)

        return extracted
    except Exception as e:
        print(f"[ColorExtractor Error] {e}")
        return [COLOR_PALETTE[0]]

def get_closest_color_name(rgb):
    min_dist = float('inf')
    best_match = COLOR_PALETTE[0]
    
    for c in COLOR_PALETTE:
        target_rgb = c["rgb"]
        dist = np.sqrt(sum((a - b) ** 2 for a, b in zip(rgb, target_rgb)))
        if dist < min_dist:
            min_dist = dist
            best_match = c
            
    return best_match
