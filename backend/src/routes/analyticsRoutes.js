const express = require('express');
const router = express.Router();
const { ClothingStore, DailyOutfitStore } = require('../models/localStore');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
  try {
    const items = await ClothingStore.find({ userId: req.user.id });

    const totalItems = items.length;
    const categoryCounts = { top: 0, bottom: 0, footwear: 0, accessory: 0 };
    const colorCounts = {};
    const patternCounts = {};

    items.forEach(item => {
      if (categoryCounts[item.category] !== undefined) {
        categoryCounts[item.category]++;
      }
      const cName = item.dominantColors?.[0]?.name || 'Other';
      colorCounts[cName] = (colorCounts[cName] || 0) + 1;

      const pName = item.pattern || 'solid';
      patternCounts[pName] = (patternCounts[pName] || 0) + 1;
    });

    // Forgotten / Under-used pieces (wearCount <= 1 or sorted ascending by wearCount)
    const sortedByWear = [...items].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));
    const forgottenGems = sortedByWear.slice(0, 4);

    // Most worn items
    const mostWornItems = [...items].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0)).slice(0, 4);

    // Most Loved Outfits
    const history = await DailyOutfitStore.find({ userId: req.user.id });
    const topCombinations = history
      .filter(o => o.harmonyScore >= 80)
      .sort((a, b) => b.harmonyScore - a.harmonyScore)
      .slice(0, 3);

    res.json({
      totalItems,
      categoryCounts,
      colorCounts,
      patternCounts,
      forgottenGems,
      mostWornItems,
      topCombinations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
