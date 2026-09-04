const fs = require('fs');
const path = require('path');
const { getColorMetadata } = require('./colorHarmony');

const COLOR_NAMES_MAP = [
  { name: 'Navy Blue', hex: '#1B263B', rgb: [27, 38, 59] },
  { name: 'Sky Blue', hex: '#87CEEB', rgb: [135, 206, 235] },
  { name: 'Royal Blue', hex: '#4169E1', rgb: [65, 105, 225] },
  { name: 'Classic Black', hex: '#111111', rgb: [17, 17, 17] },
  { name: 'Pure White', hex: '#FAFAFA', rgb: [250, 250, 250] },
  { name: 'Heather Grey', hex: '#888888', rgb: [136, 136, 136] },
  { name: 'Crimson Red', hex: '#DC143C', rgb: [220, 20, 60] },
  { name: 'Olive Green', hex: '#556B2F', rgb: [85, 107, 47] },
  { name: 'Emerald Green', hex: '#50C878', rgb: [80, 200, 120] },
  { name: 'Mustard Yellow', hex: '#FFDB58', rgb: [255, 219, 88] },
  { name: 'Beige / Tan', hex: '#F5F5DC', rgb: [245, 245, 220] },
  { name: 'Blush Pink', hex: '#FFB6C1', rgb: [255, 182, 193] },
  { name: 'Burgundy', hex: '#800020', rgb: [128, 0, 32] },
  { name: 'Lavender', hex: '#E6E6FA', rgb: [230, 230, 250] },
  { name: 'Gold / Warm Metallic', hex: '#FFD700', rgb: [255, 215, 0] }
];

async function analyzeUploadedImage(filePath, hintCategory = null, filename = '') {
  let category = hintCategory || inferCategoryFromFilename(filename) || 'top';
  let subCategory = inferSubCategory(filename, category);
  let dominantColors = extractColorsFromFilenameOrFallback(filename);
  let pattern = inferPattern(filename);
  let styleTags = inferStyleTags(filename, category, subCategory);

  const primaryHex = dominantColors[0]?.hex || '#4169E1';
  const meta = getColorMetadata(primaryHex);

  return {
    category,
    subCategory,
    dominantColors,
    secondaryColors: dominantColors.slice(1),
    pattern,
    styleTags,
    colorTemperature: meta.temperature,
    vibrancy: meta.vibrancy
  };
}

function inferCategoryFromFilename(filename = '') {
  const name = filename.toLowerCase();
  if (name.includes('jean') || name.includes('pant') || name.includes('trouser') || name.includes('short') || name.includes('skirt') || name.includes('bottom')) return 'bottom';
  if (name.includes('shoe') || name.includes('sneaker') || name.includes('boot') || name.includes('loafer') || name.includes('footwear') || name.includes('sandal')) return 'footwear';
  if (name.includes('watch') || name.includes('belt') || name.includes('bag') || name.includes('jewel') || name.includes('hat') || name.includes('accessory') || name.includes('sunglass')) return 'accessory';
  if (name.includes('shirt') || name.includes('top') || name.includes('tee') || name.includes('hoodie') || name.includes('jacket') || name.includes('kurta') || name.includes('polo')) return 'top';
  return null;
}

function inferSubCategory(filename = '', category = 'top') {
  const name = filename.toLowerCase();
  if (category === 'top') {
    if (name.includes('polo')) return 'polo';
    if (name.includes('kurta') || name.includes('ethnic')) return 'ethnic_wear';
    if (name.includes('jacket') || name.includes('blazer')) return 'blazer';
    if (name.includes('tshirt') || name.includes('tee')) return 'tshirt';
    return 'shirt';
  }
  if (category === 'bottom') {
    if (name.includes('jean')) return 'jeans';
    if (name.includes('short')) return 'shorts';
    return 'trousers';
  }
  if (category === 'footwear') {
    if (name.includes('loafer') || name.includes('formal')) return 'loafers';
    if (name.includes('ethnic') || name.includes('mojari')) return 'ethnic_shoes';
    return 'sneakers';
  }
  if (category === 'accessory') {
    if (name.includes('watch')) return 'watch';
    if (name.includes('belt')) return 'belt';
    if (name.includes('jewel') || name.includes('chain')) return 'jewelry';
    return 'accessory';
  }
  return 'general';
}

function inferPattern(filename = '') {
  const name = filename.toLowerCase();
  if (name.includes('stripe')) return 'striped';
  if (name.includes('plaid') || name.includes('check')) return 'plaid';
  if (name.includes('flower') || name.includes('floral')) return 'floral';
  if (name.includes('polka') || name.includes('dot')) return 'polka_dots';
  if (name.includes('graphic') || name.includes('print')) return 'graphic';
  return 'solid';
}

function inferStyleTags(filename = '', category, subCategory) {
  const name = filename.toLowerCase();
  const tags = new Set();

  if (name.includes('casual') || subCategory === 'tshirt' || subCategory === 'jeans' || subCategory === 'sneakers') {
    tags.add('casual');
    tags.add('college');
  }
  if (name.includes('formal') || name.includes('office') || subCategory === 'blazer' || subCategory === 'trousers' || subCategory === 'loafers') {
    tags.add('formal');
    tags.add('office');
    tags.add('smart_casual');
  }
  if (name.includes('party') || name.includes('stylish') || name.includes('bold')) {
    tags.add('party');
    tags.add('stylish');
  }
  if (name.includes('ethnic') || name.includes('traditional') || subCategory === 'ethnic_wear') {
    tags.add('ethnic');
    tags.add('traditional');
  }

  if (tags.size === 0) {
    tags.add('casual');
    tags.add('versatile');
  }

  return Array.from(tags);
}

function extractColorsFromFilenameOrFallback(filename = '') {
  const name = filename.toLowerCase();
  const matched = [];

  for (const c of COLOR_NAMES_MAP) {
    if (name.includes(c.name.toLowerCase().split(' ')[0])) {
      matched.push(c);
    }
  }

  if (matched.length > 0) return matched;

  // Pick high aesthetic default colors based on hash
  const idx = Math.abs(hashCode(filename)) % COLOR_NAMES_MAP.length;
  const idx2 = (idx + 3) % COLOR_NAMES_MAP.length;
  return [COLOR_NAMES_MAP[idx], COLOR_NAMES_MAP[idx2]];
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

module.exports = {
  analyzeUploadedImage,
  COLOR_NAMES_MAP
};
