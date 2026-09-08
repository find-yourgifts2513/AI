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

const COLOR_KEYWORDS = {
  navy: 'Navy Blue',
  blue: 'Royal Blue',
  sky: 'Sky Blue',
  black: 'Classic Black',
  white: 'Pure White',
  grey: 'Heather Grey',
  gray: 'Heather Grey',
  red: 'Crimson Red',
  olive: 'Olive Green',
  green: 'Emerald Green',
  yellow: 'Mustard Yellow',
  mustard: 'Mustard Yellow',
  beige: 'Beige / Tan',
  tan: 'Beige / Tan',
  pink: 'Blush Pink',
  burgundy: 'Burgundy',
  lavender: 'Lavender',
  purple: 'Lavender',
  gold: 'Gold / Warm Metallic'
};

async function analyzeUploadedImage(filePath, hintCategory = null, filename = '') {
  let category = hintCategory || inferCategoryFromFilename(filename) || 'top';
  let subCategory = inferSubCategory(filename, category);
  let dominantColors = extractColorsFromFilename(filename);
  let pattern = inferPattern(filename);

  if (filePath) {
    try {
      const visionResult = await analyzeWithVisionEngine(filePath);
      if (visionResult?.dominant_colors?.length) {
        dominantColors = visionResult.dominant_colors.map(normalizeColor);
      }
      if (visionResult?.pattern) {
        pattern = normalizePattern(visionResult.pattern);
      }
    } catch (error) {
      console.warn(`[AI Tagging] Vision engine unavailable: ${error.message}`);
    }
  }

  if (dominantColors.length === 0) {
    dominantColors = [COLOR_NAMES_MAP[0]];
  }
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

async function analyzeWithVisionEngine(filePath) {
  const engineUrl = process.env.AI_ENGINE_URL || 'http://127.0.0.1:5001';
  const imageData = fs.readFileSync(filePath).toString('base64');
  const response = await fetch(`${engineUrl.replace(/\/$/, '')}/analyze-clothing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_data: imageData })
  });

  if (!response.ok) {
    throw new Error(`AI engine returned HTTP ${response.status}`);
  }
  return response.json();
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
    if (name.includes('jewel') || name.includes('chain') || name.includes('bracelet')) return 'jewelry';
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

function extractColorsFromFilename(filename = '') {
  const name = filename.toLowerCase();
  const matched = [];

  for (const c of COLOR_NAMES_MAP) {
    const colorName = c.name.toLowerCase().split(' ')[0];
    if (name.includes(colorName) || Object.entries(COLOR_KEYWORDS).some(([keyword, mappedName]) => mappedName === c.name && name.includes(keyword))) {
      matched.push(c);
    }
  }

  return matched;
}

function normalizeColor(color) {
  const rgb = Array.isArray(color.rgb) ? color.rgb : [0, 0, 0];
  return {
    name: color.name || 'Unknown',
    hex: color.hex || rgbToHex(rgb),
    rgb
  };
}

function rgbToHex(rgb) {
  return `#${rgb.map(value => Math.max(0, Math.min(255, Number(value) || 0)).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function normalizePattern(pattern) {
  const supportedPatterns = new Set(['solid', 'striped', 'plaid', 'floral', 'polka_dots', 'graphic', 'checkered']);
  return supportedPatterns.has(pattern) ? pattern : 'solid';
}

module.exports = {
  analyzeUploadedImage,
  COLOR_NAMES_MAP
};
