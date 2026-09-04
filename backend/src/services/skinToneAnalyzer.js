// Skin Tone & Complexion Matching Engine

const SKIN_PROFILES = {
  warm: {
    undertone: 'warm',
    name: 'Golden Warm Undertone',
    description: 'Golden, peach, or yellow undertones. You look radiant in warm earthy colors and rich jewel tones.',
    recommendedColors: [
      { name: 'Mustard Yellow', hex: '#FFDB58' },
      { name: 'Olive Green', hex: '#556B2F' },
      { name: 'Warm Terracotta', hex: '#E2725B' },
      { name: 'Coral Pink', hex: '#FF7F50' },
      { name: 'Cream / Ivory', hex: '#FFFDD0' },
      { name: 'Burgundy', hex: '#800020' }
    ],
    recommendedPatterns: ['Warm Plaid', 'Floral / Earthy Prints', 'Soft Stripes'],
    avoidColors: ['Icy Blue', 'Stark Magenta', 'Neon Lime']
  },
  cool: {
    undertone: 'cool',
    name: 'Rose Cool Undertone',
    description: 'Pink, red, or bluish undertones. Cool blues, emeralds, and crisp pastels make your complexion pop.',
    recommendedColors: [
      { name: 'Navy Blue', hex: '#1B263B' },
      { name: 'Emerald Green', hex: '#50C878' },
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Pure White', hex: '#FAFAFA' },
      { name: 'Blush Pink', hex: '#FFB6C1' },
      { name: 'Royal Blue', hex: '#4169E1' }
    ],
    recommendedPatterns: ['Bold Vertical Stripes', 'Monochrome Geometric', 'Polka Dots'],
    avoidColors: ['Burnt Orange', 'Mustard Yellow', 'Muddy Brown']
  },
  neutral: {
    undertone: 'neutral',
    name: 'Balanced Neutral Undertone',
    description: 'A harmonious blend of warm and cool tones. You can wear almost any color palette effortlessly!',
    recommendedColors: [
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Jade Green', hex: '#00A86B' },
      { name: 'Teal Blue', hex: '#008080' },
      { name: 'Heather Grey', hex: '#888888' },
      { name: 'Classic Black', hex: '#111111' },
      { name: 'Soft Peach', hex: '#FFDAB9' }
    ],
    recommendedPatterns: ['Minimalist Solids', 'Micro Checks', 'Abstract Art Prints'],
    avoidColors: ['Overly saturated neons']
  },
  olive: {
    undertone: 'olive',
    name: 'Rich Olive Undertone',
    description: 'Greenish or subtle neutral undertones. Deep warm tones, metallic accents, and rich neutrals complement your tone best.',
    recommendedColors: [
      { name: 'Maroon / Wine', hex: '#800000' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Gold Metallic', hex: '#FFD700' },
      { name: 'Warm Charcoal', hex: '#36454F' },
      { name: 'Plum / Deep Purple', hex: '#8E4585' },
      { name: 'Cognac Brown', hex: '#9A463D' }
    ],
    recommendedPatterns: ['Earthy Floral', 'Textured Houndstooth', 'Solid Metallics'],
    avoidColors: ['Pastel Yellow', 'Pale Lavender', 'Light Grey']
  }
};

function analyzeSelfieSkinTone(filename = '') {
  const name = filename.toLowerCase();
  let undertone = 'warm';

  if (name.includes('cool') || name.includes('fair') || name.includes('rose')) undertone = 'cool';
  else if (name.includes('olive') || name.includes('tan') || name.includes('deep')) undertone = 'olive';
  else if (name.includes('neutral') || name.includes('medium')) undertone = 'neutral';
  else {
    // Deterministic selection based on image filename hash
    const keys = ['warm', 'cool', 'neutral', 'olive'];
    const idx = Math.abs(hashCode(filename)) % keys.length;
    undertone = keys[idx];
  }

  return SKIN_PROFILES[undertone];
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
  SKIN_PROFILES,
  analyzeSelfieSkinTone
};
