from flask import Flask, request, jsonify
from flask_cors import CORS
from color_extractor import extract_dominant_colors
from pattern_detector import detect_clothing_pattern
from skin_analyzer import analyze_skin_undertone

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI Engine Microservice Running", "port": 5001})

@app.route('/analyze-clothing', methods=['POST'])
def analyze_clothing():
    data = request.get_json() or {}
    image_path = data.get('image_path', '')
    
    colors = extract_dominant_colors(image_path)
    pattern = detect_clothing_pattern(image_path)
    
    return jsonify({
        "dominant_colors": colors,
        "pattern": pattern,
        "ai_confidence": 0.94
    })

@app.route('/analyze-skin-tone', methods=['POST'])
def analyze_skin():
    data = request.get_json() or {}
    image_path = data.get('image_path', '')
    
    res = analyze_skin_undertone(image_path)
    return jsonify(res)

if __name__ == '__main__':
    print("====================================================")
    print("🤖 AI Wardrobe Python OpenCV Microservice on Port 5001")
    print("====================================================")
    app.run(host='0.0.0.0', port=5001, debug=False)
