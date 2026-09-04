const express = require('express');
const router = express.Router();
const { ClothingStore, UserStore } = require('../models/localStore');
const { protect } = require('../middleware/authMiddleware');
const { generateOutfitRecommendations } = require('../services/aiRecommendationService');

router.post('/generate', protect, async (req, res) => {
  try {
    const { mood = 'Energetic', occasion = 'College' } = req.body;
    const items = await ClothingStore.find();

    const user = await UserStore.findById(req.user.id);
    const skinProfile = user?.skinToneProfile || null;

    const recommendations = generateOutfitRecommendations(items, {
      mood,
      occasion,
      skinProfile,
      limit: 6
    });

    res.json({
      mood,
      occasion,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
