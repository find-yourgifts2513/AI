const cron = require('node-cron');
const { ClothingStore, DailyOutfitStore } = require('../models/localStore');
const { generateOutfitRecommendations } = require('../services/aiRecommendationService');

function initDailyOutfitScheduler() {
  console.log('[Daily Scheduler] Initializing Daily Outfit Push Scheduler (Cron pattern: 0 0 * * * - Every Midnight & auto-generate on startup)');

  // Run immediately on boot to ensure today's outfit exists
  generateTodayOutfitIfNeeded();

  // Schedule daily cron trigger at midnight 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('[Daily Scheduler Cron Trigger] Generating daily outfit push suggestion...');
    await generateTodayOutfitIfNeeded(true);
  });
}

async function generateTodayOutfitIfNeeded(forceNew = false) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if outfit for today already exists
    const existing = await DailyOutfitStore.findOne({ date: todayStr });
    if (existing && !forceNew) {
      return existing;
    }

    // Get all user clothing items
    const items = await ClothingStore.find();
    if (!items || items.length === 0) {
      console.warn('[Daily Scheduler] No items found in wardrobe to schedule outfit.');
      return null;
    }

    const moods = ['Energetic', 'Calm', 'Romantic', 'Confident'];
    const occasions = ['College', 'Office', 'Party', 'Traditional'];

    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const randomOccasion = occasions[Math.floor(Math.random() * occasions.length)];

    const recs = generateOutfitRecommendations(items, { mood: randomMood, occasion: randomOccasion, limit: 1 });

    if (recs.length === 0) return null;

    const topRec = recs[0];
    const outfitData = {
      userId: 'demo-user-123',
      date: todayStr,
      topItem: topRec.topItem._id || topRec.topItem.id,
      bottomItem: topRec.bottomItem._id || topRec.bottomItem.id,
      footwearItem: topRec.footwearItem ? (topRec.footwearItem._id || topRec.footwearItem.id) : null,
      accessoryItem: topRec.accessoryItem ? (topRec.accessoryItem._id || topRec.accessoryItem.id) : null,
      mood: randomMood,
      occasion: randomOccasion,
      harmonyScore: topRec.harmonyScore,
      explanation: topRec.explanation,
      accepted: false,
      createdAt: new Date().toISOString()
    };

    const created = await DailyOutfitStore.create(outfitData);
    console.log(`[Daily Scheduler] Successfully generated Outfit of the Day for ${todayStr} (${randomMood} / ${randomOccasion})`);
    return created;

  } catch (err) {
    console.error('[Daily Scheduler Error]', err);
    return null;
  }
}

module.exports = {
  initDailyOutfitScheduler,
  generateTodayOutfitIfNeeded
};
