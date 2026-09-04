const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { analyzeSelfieSkinTone } = require('../services/skinToneAnalyzer');
const { UserStore, ClothingStore } = require('../models/localStore');

const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.post('/analyze', protect, upload.single('selfie'), async (req, res) => {
  try {
    const filename = req.file ? req.file.filename : (req.body.filename || 'selfie.jpg');

    const result = analyzeSelfieSkinTone(filename);

    // Save profile to user
    await UserStore.findByIdAndUpdate(req.user.id, {
      $set: {
        skinToneProfile: {
          undertone: result.undertone,
          complexion: req.body.complexion || 'medium',
          recommendedColors: result.recommendedColors.map(c => c.hex),
          avoidColors: result.avoidColors,
          lastUpdated: new Date().toISOString()
        }
      }
    });

    // Find complementary wardrobe items in the logged-in user's wardrobe
    const allItems = await ClothingStore.find({ userId: req.user.id });
    const recHexes = result.recommendedColors.map(c => c.hex.toLowerCase());

    const complementaryItems = allItems.filter(item => {
      const topHex = item.dominantColors?.[0]?.hex?.toLowerCase();
      return topHex && recHexes.includes(topHex);
    });

    res.json({
      message: 'Skin tone analyzed successfully!',
      profile: result,
      matchingWardrobeItems: complementaryItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get skin profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await UserStore.findById(req.user.id);
    const profile = user?.skinToneProfile || analyzeSelfieSkinTone('default');
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
