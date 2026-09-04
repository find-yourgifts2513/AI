const { calculateColorHarmony, evaluateMoodScore, evaluateOccasionScore } = require('./colorHarmony');

function generateOutfitRecommendations(items, { mood = 'Energetic', occasion = 'College', skinProfile = null, limit = 5 }) {
  if (!items || items.length === 0) {
    return [];
  }

  const tops = items.filter(item => item.category === 'top');
  const bottoms = items.filter(item => item.category === 'bottom');
  const footwears = items.filter(item => item.category === 'footwear');
  const accessories = items.filter(item => item.category === 'accessory');

  if (tops.length === 0 || bottoms.length === 0) {
    return [];
  }

  const combinations = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      // Pick best footwear option
      let bestFootwear = footwears.find(f => isFootwearMatch(f, occasion)) || footwears[0] || null;
      // Pick best accessory option
      let bestAccessory = accessories.find(a => isAccessoryMatch(a, occasion, mood)) || accessories[0] || null;

      const colorScore = calculateColorHarmony(
        top.dominantColors?.[0]?.hex,
        bottom.dominantColors?.[0]?.hex
      );

      const moodScore = evaluateMoodScore(top, bottom, bestFootwear, bestAccessory, mood);
      const occasionScore = evaluateOccasionScore(top, bottom, bestFootwear, bestAccessory, occasion);

      let skinBonus = 0;
      if (skinProfile && skinProfile.recommendedColors) {
        const recHexes = skinProfile.recommendedColors.map(c => typeof c === 'string' ? c.toLowerCase() : c.hex.toLowerCase());
        const topHex = top.dominantColors?.[0]?.hex?.toLowerCase();
        if (topHex && recHexes.some(h => isSimilarColor(h, topHex))) {
          skinBonus += 15;
        }
      }

      // Weighted total harmony score calculation
      const totalScore = Math.min(100, Math.round(
        (colorScore * 0.35) +
        (moodScore * 0.30) +
        (occasionScore * 0.25) +
        (skinBonus * 0.10)
      ));

      const explanation = generateStylingExplanation(top, bottom, bestFootwear, bestAccessory, mood, occasion, totalScore);

      combinations.push({
        topItem: top,
        bottomItem: bottom,
        footwearItem: bestFootwear,
        accessoryItem: bestAccessory,
        harmonyScore: totalScore,
        colorHarmonyScore: colorScore,
        moodScore,
        occasionScore,
        mood,
        occasion,
        explanation
      });
    }
  }

  // Sort by highest overall score descending
  combinations.sort((a, b) => b.harmonyScore - a.harmonyScore);

  return combinations.slice(0, limit);
}

function isFootwearMatch(footwear, occasion) {
  if (!footwear) return false;
  const sub = footwear.subCategory;
  if (occasion === 'College' && sub === 'sneakers') return true;
  if (occasion === 'Office' && sub === 'loafers') return true;
  if (occasion === 'Traditional' && sub === 'ethnic_shoes') return true;
  if (occasion === 'Party') return true;
  return false;
}

function isAccessoryMatch(accessory, occasion, mood) {
  if (!accessory) return false;
  if (occasion === 'Party' || mood === 'Confident') return true;
  if (accessory.subCategory === 'watch' && (occasion === 'Office' || occasion === 'College')) return true;
  return true;
}

function isSimilarColor(hex1, hex2) {
  if (!hex1 || !hex2) return false;
  return hex1 === hex2 || calculateColorHarmony(hex1, hex2) > 85;
}

function generateStylingExplanation(top, bottom, footwear, accessory, mood, occasion, score) {
  const topColor = top.dominantColors?.[0]?.name || 'top';
  const bottomColor = bottom.dominantColors?.[0]?.name || 'bottom';
  const accName = accessory ? accessory.name : 'minimal accent';

  let text = `Matched ${top.name} (${topColor}) with ${bottom.name} (${bottomColor}). `;

  if (mood === 'Energetic') {
    text += `Dynamically selected vibrant color contrasts to elevate an energetic vibe. `;
  } else if (mood === 'Calm') {
    text += `Selected harmonious, soothing undertones for a calm, composed appearance. `;
  } else if (mood === 'Romantic') {
    text += `Paired soft tones and fluid lines for a romantic aesthetic. `;
  } else if (mood === 'Confident') {
    text += `Combined bold contrast and sleek silhouette for high-confidence presence. `;
  }

  text += `Tailored specifically for ${occasion} mode`;
  if (accessory) {
    text += ` completed with auto-matched ${accName}.`;
  } else {
    text += `.`;
  }

  return text;
}

module.exports = {
  generateOutfitRecommendations
};
