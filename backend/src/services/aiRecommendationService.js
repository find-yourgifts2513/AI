const { calculateColorHarmony, evaluateMoodScore, evaluateOccasionScore } = require('./colorHarmony');

function generateOutfitRecommendations(items, { mood = 'Energetic', occasion = 'College', skinProfile = null, limit = 5 }) {
  if (!items || items.length === 0) {
    return [];
  }

  const tops = items.filter(item => item.category === 'top');
  const bottoms = items.filter(item => item.category === 'bottom');
  const footwears = items.filter(item => item.category === 'footwear');
  const watches = items.filter(item => item.category === 'accessory' && item.subCategory === 'watch');
  const accessories = items.filter(item => item.category === 'accessory' && item.subCategory !== 'watch');

  if (tops.length === 0 || bottoms.length === 0) {
    return [];
  }

  const combinations = [];
  const footwearOptions = footwears.length ? footwears : [null];
  const watchOptions = watches.length ? watches : [null];
  const accessoryOptions = accessories.length ? accessories : [null];

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const footwear of footwearOptions) {
        for (const watch of watchOptions) {
          for (const accessory of accessoryOptions) {
            const bestFootwear = footwear;
            const bestWatch = watch;
            const bestAccessory = accessory;

            if (bestWatch && bestAccessory && getItemId(bestWatch) === getItemId(bestAccessory)) continue;

            const colorScore = calculateOutfitColorScore(top, bottom, bestFootwear, bestWatch, bestAccessory);
            const moodScore = evaluateMoodScore(top, bottom, bestFootwear, bestAccessory || bestWatch, mood);
            const occasionScore = evaluateOccasionScore(top, bottom, bestFootwear, bestAccessory || bestWatch, occasion);
            const accessoryScore = scoreAccessorySet(bestWatch, bestAccessory, occasion, mood);

            let skinBonus = 0;
            if (skinProfile && skinProfile.recommendedColors) {
              const recHexes = skinProfile.recommendedColors.map(c => typeof c === 'string' ? c.toLowerCase() : c.hex.toLowerCase());
              const topHex = top.dominantColors?.[0]?.hex?.toLowerCase();
              if (topHex && recHexes.some(h => isSimilarColor(h, topHex))) skinBonus += 15;
            }

            const totalScore = Math.min(100, Math.round(
              (colorScore * 0.30) + (moodScore * 0.25) +
              (occasionScore * 0.25) + (accessoryScore * 0.10) + (skinBonus * 0.10)
            ));

            const explanation = generateStylingExplanation(top, bottom, bestFootwear, bestWatch, bestAccessory, mood, occasion, totalScore);

            combinations.push({
              topItem: top, bottomItem: bottom, footwearItem: bestFootwear,
              watchItem: bestWatch, accessoryItem: bestAccessory,
              harmonyScore: totalScore, colorHarmonyScore: colorScore,
              moodScore, occasionScore, mood, occasion, explanation
            });
          }
        }
      }
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

function calculateOutfitColorScore(top, bottom, footwear, watch, accessory) {
  const colors = [top, bottom, footwear, watch, accessory]
    .filter(Boolean)
    .map(item => item.dominantColors?.[0]?.hex)
    .filter(Boolean);
  if (colors.length < 2) return 70;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      total += calculateColorHarmony(colors[i], colors[j]);
      pairs++;
    }
  }
  return Math.round(total / pairs);
}

function scoreAccessorySet(watch, accessory, occasion, mood) {
  let score = 65;
  if (watch) score += occasion === 'College' || occasion === 'Office' ? 20 : 5;
  if (accessory) score += occasion === 'Party' || mood === 'Confident' ? 20 : 8;
  return Math.min(100, score);
}

function getItemId(item) {
  return item?._id || item?.id;
}

function isSimilarColor(hex1, hex2) {
  if (!hex1 || !hex2) return false;
  return hex1 === hex2 || calculateColorHarmony(hex1, hex2) > 85;
}

function generateStylingExplanation(top, bottom, footwear, watch, accessory, mood, occasion, score) {
  const topColor = top.dominantColors?.[0]?.name || 'top';
  const bottomColor = bottom.dominantColors?.[0]?.name || 'bottom';
  const accName = [watch?.name, accessory?.name].filter(Boolean).join(' and ') || 'minimal accents';

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
  if (watch || accessory) {
    text += ` completed with auto-matched ${accName}.`;
  } else {
    text += `.`;
  }

  return text;
}

module.exports = {
  generateOutfitRecommendations
};
