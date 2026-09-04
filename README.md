# AI Wardrobe 👗✨
### Full-Stack AI-Powered Wardrobe & Outfit Recommendation Engine

**AI Wardrobe** is an intelligent full-stack web application designed to auto-tag clothing items using computer vision, dynamically score and suggest complete 4-piece outfits (Upper + Lower + Footwear + Accessories) based on color harmony, mood, occasion, and skin undertone matching, auto-push daily scheduled suggestions, provide wardrobe analytics, and enable WebAR try-on fitting.

---

## 🌟 Key Features

1. **Wardrobe Management & AI Auto-Tagging**
   - Upload clothing items (tops, bottoms, footwear, accessories) at any time.
   - OpenCV & K-Means computer vision auto-tags item category, dominant RGB/HSV colors, texture patterns (solids, stripes, plaid, floral, polka dots), and style tags.
   - Mongoose MongoDB database integration with an automatic embedded JSON/SQLite database fallback so the app works seamlessly out-of-the-box.

2. **AI Outfit Recommendation Engine**
   - **Color Harmony**: Evaluates Complementary, Monochromatic, Triadic, and Analogous color relationships.
   - **Mood-Based Styling**: Dynamic match determination (no hardcoded colors) for **Energetic**, **Calm**, **Romantic**, and **Confident** vibes.
   - **Occasion Mode**:
     - *College*: neat casuals (polo/shirts + jeans + sneakers).
     - *Office*: smart formals (oxford shirts + trousers + loafers).
     - *Party*: stylish contrasts with statement accessories.
     - *Traditional*: ethnic wear pairings with matching footwear.

3. **Skin Tone Matching**
   - Selfie upload skin tone analysis (OpenCV face region sampling & LAB color space undertone extraction).
   - Classifies undertone into **Golden Warm**, **Rose Cool**, **Neutral**, or **Olive**.
   - Generates complementary color palette chips and filters matching wardrobe pieces.

4. **Daily Outfit Scheduler**
   - Node-cron scheduler running daily to auto-generate and push the "Outfit of the Day".
   - Stores daily recommendation logs & history calendar.

5. **Wardrobe Analytics**
   - Usage frequency tracking for every clothing item.
   - Under-used pieces identification ("Forgotten Gems").
   - Category ratio distribution & dominant color palette charts.
   - Most-loved outfit combinations.

6. **Aesthetic UI & Theme Customization**
   - Built with React, Vite, Tailwind CSS, Lucide Icons, and Framer Motion.
   - Toggle between **Pastel Light Theme** 🌸 and **Galaxy Dark Theme** 🌌.
   - Dynamic **Mood-Based Background Gradients** (Amber for Energetic, Ocean Cyan for Calm, Rose Quartz for Romantic, Indigo Velvet for Confident).

7. **WebAR Virtual Try-On Studio**
   - Interactive fitting canvas allowing users to position wardrobe tops & accessories on live webcam feed or mannequin preview.

---

## 🏗️ Project Architecture

```
AI-wardrobe/
├── backend/                  # Node.js + Express API Server
│   ├── src/
│   │   ├── config/           # Database setup (MongoDB + local fallback)
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Mongoose schemas + LocalStore unified interface
│   │   ├── routes/           # REST API endpoints (/auth, /wardrobe, /recommendations, /skin-tone, /scheduler, /analytics)
│   │   ├── services/         # Color harmony math & AI styling recommendation logic
│   │   ├── scheduler/        # Node-cron daily outfit push service
│   │   └── server.js         # Backend server entry point (Port 5000)
│   ├── uploads/              # Local storage for item images
│   └── package.json
│
├── ai_engine/                # Python Computer Vision & OpenCV Microservice
│   ├── app.py                # Flask REST Microservice (Port 5001)
│   ├── color_extractor.py    # K-Means HSV color clustering & dominant color extraction
│   ├── pattern_detector.py   # Canny edge density & FFT pattern detector
│   ├── skin_analyzer.py      # Face LAB color space skin undertone classifier
│   └── requirements.txt
│
└── frontend/                 # React + Tailwind CSS Web Client (Vite)
    ├── src/
    │   ├── components/       # Navbar, Footer, ItemCard, OutfitCard, UploadModal
    │   ├── context/          # ThemeContext & AuthContext
    │   ├── pages/            # Dashboard, Wardrobe, OutfitGenerator, SkinTone, Scheduler, Analytics, TryOn
    │   ├── services/         # Axios API client
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 How to Run the Application

### 1. Install Dependencies

In the root directory, install dependencies for root, backend, frontend, and AI engine:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install Python AI microservice dependencies (Optional)
cd ../ai_engine
pip install -r requirements.txt
```

### 2. Start the Application

You can start the Backend and Frontend concurrently using root scripts:

```bash
# From project root directory:
npm run start:backend   # Starts Express server on http://localhost:5000
npm run start:frontend  # Starts Vite React client on http://localhost:3000

# Optionally start Python OpenCV Microservice (in separate terminal):
npm run start:ai        # Starts Flask AI service on http://localhost:5001
```

Open your browser at **`http://localhost:3000`** to experience the AI Wardrobe platform!

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User login / JWT token generation |
| `POST` | `/api/wardrobe/upload` | Upload image & trigger AI auto-tagging |
| `GET` | `/api/wardrobe` | Fetch wardrobe items with filters |
| `POST` | `/api/wardrobe/:id/wear` | Increment item wear count |
| `POST` | `/api/recommendations/generate` | Generate outfit combos by Mood & Occasion |
| `POST` | `/api/skin-tone/analyze` | Selfie scan & skin undertone analysis |
| `GET` | `/api/scheduler/today` | Fetch today's auto-pushed outfit suggestion |
| `POST` | `/api/scheduler/refresh` | Force refresh today's daily outfit suggestion |
| `GET` | `/api/analytics/stats` | Fetch usage stats, under-used pieces & top combos |
