const express = require('express');
const router = express.Router();
const { DailyOutfitStore, ClothingStore } = require('../models/localStore');
const { protect } = require('../middleware/authMiddleware');
const { generateTodayOutfitIfNeeded } = require('../scheduler/dailyOutfitCron');

// Get Today's Daily Outfit Suggestion
router.get('/today', protect, async (req, res) => {
  try {
    let todayOutfit = await generateTodayOutfitIfNeeded(req.user.id);

    if (!todayOutfit) {
      return res.status(404).json({ message: 'No outfit generated for today yet. Please add items to wardrobe first.' });
    }

    // Populate item details
    const populated = await populateOutfit(todayOutfit);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Force generate/refresh Today's Outfit
router.post('/refresh', protect, async (req, res) => {
  try {
    const refreshed = await generateTodayOutfitIfNeeded(req.user.id, true);
    const populated = await populateOutfit(refreshed);
    res.json({ message: 'Today\'s outfit refreshed!', outfit: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Outfit History
router.get('/history', protect, async (req, res) => {
  try {
    const history = await DailyOutfitStore.find({ userId: req.user.id });
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    const populatedHistory = await Promise.all(history.map(populateOutfit));
    res.json(populatedHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function populateOutfit(outfit) {
  if (!outfit) return null;

  const top = outfit.topItem ? await ClothingStore.findById(outfit.topItem) : null;
  const bottom = outfit.bottomItem ? await ClothingStore.findById(outfit.bottomItem) : null;
  const footwear = outfit.footwearItem ? await ClothingStore.findById(outfit.footwearItem) : null;
  const watch = outfit.watchItem ? await ClothingStore.findById(outfit.watchItem) : null;
  const accessory = outfit.accessoryItem ? await ClothingStore.findById(outfit.accessoryItem) : null;

  return {
    ...outfit,
    topItem: top,
    bottomItem: bottom,
    footwearItem: footwear,
    watchItem: watch,
    accessoryItem: accessory
  };
}

module.exports = router;
