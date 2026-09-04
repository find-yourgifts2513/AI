// Color Harmony & Dynamic Styling Engine

function hexToRgb(hex) {
  if (!hex) return [128, 128, 128];
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

// Calculate color temperature & saturation profile
function getColorMetadata(hex) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, v] = rgbToHsv(r, g, b);

  let temperature = 'neutral';
  if ((h >= 0 && h <= 60) || (h >= 300 && h <= 360)) {
    temperature = 'warm'; // Red, Orange, Yellow, Pink
  } else if (h >= 150 && h <= 270) {
    temperature = 'cool'; // Blue, Green, Cyan, Purple
  }

  let vibrancy = 'muted';
  if (s > 60 && v > 50) vibrancy = 'vibrant';
  else if (s < 30 && v > 70) vibrancy = 'pastel';
  else if (v < 35) vibrancy = 'dark';

  return { r, g, b, h, s, v, temperature, vibrancy };
}

// Color Harmony Score between two hex colors (0 - 100)
function calculateColorHarmony(hex1, hex2) {
  if (!hex1 || !hex2) return 70;
  const c1 = getColorMetadata(hex1);
  const c2 = getColorMetadata(hex2);

  // If neutral colors (black, white, grey, beige, denim blue), high compatibility
  const isNeutral1 = c1.s < 15 || c1.v < 20 || c1.v > 90 || (c1.h >= 200 && c1.h <= 240 && c1.s < 40);
  const isNeutral2 = c2.s < 15 || c2.v < 20 || c2.v > 90 || (c2.h >= 200 && c2.h <= 240 && c2.s < 40);

  if (isNeutral1 || isNeutral2) {
    return 92; // Neutrals match almost everything
  }

  const hueDiff = Math.abs(c1.h - c2.h);
  const shortestHueDiff = Math.min(hueDiff, 360 - hueDiff);

  // Monochromatic match (same hue, varying saturation/value)
  if (shortestHueDiff < 25) {
    return 88;
  }
  // Analogous match (adjacent hues on color wheel: ~30 deg)
  if (shortestHueDiff >= 25 && shortestHueDiff <= 55) {
    return 95;
  }
  // Triadic / Split-Complementary (~120 deg)
  if (shortestHueDiff >= 105 && shortestHueDiff <= 135) {
    return 86;
  }
  // Complementary match (opposite on color wheel: ~180 deg)
  if (shortestHueDiff >= 150 && shortestHueDiff <= 210) {
    return 90;
  }

  return 65; // Default moderate match score
}

// Dynamic Mood-Based Color & Styling Weights
// Energetic: high saturation, warm/vibrant contrast
// Calm: muted/pastel tones, cool temperature, low hue diff
// Romantic: soft warm/pink/pastel, smooth analogous contrast
// Confident: bold dark + vibrant high contrast
function evaluateMoodScore(top, bottom, footwear, accessory, mood) {
  const topColor = top?.dominantColors?.[0]?.hex || '#ffffff';
  const bottomColor = bottom?.dominantColors?.[0]?.hex || '#000000';
  const topMeta = getColorMetadata(topColor);
  const bottomMeta = getColorMetadata(bottomColor);

  let score = 75;

  switch (mood) {
    case 'Energetic':
      if (topMeta.vibrancy === 'vibrant' || bottomMeta.vibrancy === 'vibrant') score += 15;
      if (topMeta.temperature === 'warm') score += 10;
      break;

    case 'Calm':
      if (topMeta.vibrancy === 'pastel' || bottomMeta.vibrancy === 'pastel' || topMeta.vibrancy === 'muted') score += 15;
      if (topMeta.temperature === 'cool' || bottomMeta.temperature === 'cool') score += 10;
      break;

    case 'Romantic':
      if (topMeta.vibrancy === 'pastel' || (topMeta.h >= 300 && topMeta.h <= 360) || (topMeta.h >= 0 && topMeta.h <= 30)) score += 20;
      break;

    case 'Confident':
      if (topMeta.vibrancy === 'dark' || bottomMeta.vibrancy === 'dark' || topMeta.vibrancy === 'vibrant') score += 15;
      if (Math.abs(topMeta.v - bottomMeta.v) > 40) score += 10; // High value contrast
      break;

    default:
      score = 80;
  }

  return Math.min(100, Math.max(50, score));
}

// Occasion Matching Logic
// College: Polo/Shirt/T-shirt + Jeans/Casual Pants + Sneakers
// Office: Shirt/Blazer + Formal Trousers + Loafers
// Party: Stylish graphic/party tops + Dark bottoms + Accessories
// Traditional: Ethnic tops/kurta + Ethnic bottoms + Traditional Footwear
function evaluateOccasionScore(top, bottom, footwear, accessory, occasion) {
  let score = 70;

  const topTags = top?.styleTags || [];
  const bottomTags = bottom?.styleTags || [];
  const footTags = footwear?.styleTags || [];
  const accTags = accessory?.styleTags || [];

  const allTags = [...topTags, ...bottomTags, ...footTags, ...accTags].map(t => t.toLowerCase());

  switch (occasion) {
    case 'College':
      if (allTags.includes('casual') || allTags.includes('college') || allTags.includes('denim')) score += 20;
      if (footwear?.subCategory === 'sneakers' || footTags.includes('sneakers')) score += 10;
      break;

    case 'Office':
      if (allTags.includes('formal') || allTags.includes('office') || allTags.includes('smart_casual')) score += 20;
      if (footwear?.subCategory === 'loafers' || footTags.includes('loafers') || footTags.includes('formal')) score += 10;
      break;

    case 'Party':
      if (allTags.includes('party') || allTags.includes('stylish') || allTags.includes('vibrant')) score += 20;
      if (accessory) score += 10; // Accessories elevate party outfits
      break;

    case 'Traditional':
      if (allTags.includes('ethnic') || allTags.includes('traditional') || top?.subCategory === 'ethnic_wear') score += 25;
      break;
  }

  // Pattern clash check (avoid wearing 2 heavy patterns together)
  const topPattern = top?.pattern || 'solid';
  const bottomPattern = bottom?.pattern || 'solid';
  if (topPattern !== 'solid' && bottomPattern !== 'solid') {
    score -= 15; // Clashing patterns
  }

  return Math.min(100, Math.max(40, score));
}

module.exports = {
  hexToRgb,
  rgbToHsv,
  getColorMetadata,
  calculateColorHarmony,
  evaluateMoodScore,
  evaluateOccasionScore
};
