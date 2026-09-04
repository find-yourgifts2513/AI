const { ClothingStore } = require('../models/localStore');

const SAMPLE_WARDROBE_ITEMS = [
  {
    name: 'Navy Blue Crisp Oxford Shirt',
    category: 'top',
    subCategory: 'shirt',
    dominantColors: [{ name: 'Navy Blue', hex: '#1B263B', rgb: [27, 38, 59] }],
    pattern: 'solid',
    styleTags: ['office', 'formal', 'smart_casual'],
    colorTemperature: 'cool',
    vibrancy: 'dark',
    wearCount: 8,
    favorite: true,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80'
  },
  {
    name: 'Mustard Yellow Casual Polo Tee',
    category: 'top',
    subCategory: 'polo',
    dominantColors: [{ name: 'Mustard Yellow', hex: '#FFDB58', rgb: [255, 219, 88] }],
    pattern: 'solid',
    styleTags: ['casual', 'college'],
    colorTemperature: 'warm',
    vibrancy: 'vibrant',
    wearCount: 2,
    favorite: false,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80'
  },
  {
    name: 'Burgundy Party Silk Shirt',
    category: 'top',
    subCategory: 'shirt',
    dominantColors: [{ name: 'Burgundy', hex: '#800020', rgb: [128, 0, 32] }],
    pattern: 'solid',
    styleTags: ['party', 'stylish'],
    colorTemperature: 'warm',
    vibrancy: 'vibrant',
    wearCount: 5,
    favorite: true,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80'
  },
  {
    name: 'Royal Blue Ethnic Kurta',
    category: 'top',
    subCategory: 'ethnic_wear',
    dominantColors: [{ name: 'Royal Blue', hex: '#4169E1', rgb: [65, 105, 225] }],
    pattern: 'floral',
    styleTags: ['ethnic', 'traditional'],
    colorTemperature: 'cool',
    vibrancy: 'vibrant',
    wearCount: 1,
    favorite: false,
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80'
  },
  {
    name: 'Classic Indigo Denim Jeans',
    category: 'bottom',
    subCategory: 'jeans',
    dominantColors: [{ name: 'Navy Blue', hex: '#1B263B', rgb: [27, 38, 59] }],
    pattern: 'solid',
    styleTags: ['casual', 'college', 'party'],
    colorTemperature: 'cool',
    vibrancy: 'dark',
    wearCount: 14,
    favorite: true,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=500&q=80'
  },
  {
    name: 'Charcoal Grey Tailored Trousers',
    category: 'bottom',
    subCategory: 'trousers',
    dominantColors: [{ name: 'Heather Grey', hex: '#4A4A4A', rgb: [74, 74, 74] }],
    pattern: 'solid',
    styleTags: ['office', 'formal'],
    colorTemperature: 'neutral',
    vibrancy: 'dark',
    wearCount: 6,
    favorite: false,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80'
  },
  {
    name: 'White Clean Leather Sneakers',
    category: 'footwear',
    subCategory: 'sneakers',
    dominantColors: [{ name: 'Pure White', hex: '#FAFAFA', rgb: [250, 250, 250] }],
    pattern: 'solid',
    styleTags: ['casual', 'college', 'party'],
    colorTemperature: 'neutral',
    vibrancy: 'pastel',
    wearCount: 12,
    favorite: true,
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80'
  },
  {
    name: 'Tan Leather Penny Loafers',
    category: 'footwear',
    subCategory: 'loafers',
    dominantColors: [{ name: 'Beige / Tan', hex: '#D2B48C', rgb: [210, 180, 140] }],
    pattern: 'solid',
    styleTags: ['office', 'formal', 'smart_casual'],
    colorTemperature: 'warm',
    vibrancy: 'muted',
    wearCount: 4,
    favorite: false,
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=80'
  },
  {
    name: 'Gold Chronograph Watch',
    category: 'accessory',
    subCategory: 'watch',
    dominantColors: [{ name: 'Gold / Warm Metallic', hex: '#FFD700', rgb: [255, 215, 0] }],
    pattern: 'solid',
    styleTags: ['office', 'party', 'stylish'],
    colorTemperature: 'warm',
    vibrancy: 'vibrant',
    wearCount: 9,
    favorite: true,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
  },
  {
    name: 'Classic Black Leather Belt',
    category: 'accessory',
    subCategory: 'belt',
    dominantColors: [{ name: 'Classic Black', hex: '#111111', rgb: [17, 17, 17] }],
    pattern: 'solid',
    styleTags: ['office', 'formal', 'casual'],
    colorTemperature: 'neutral',
    vibrancy: 'dark',
    wearCount: 15,
    favorite: false,
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80'
  }
];

async function seedData() {
  try {
    const existing = await ClothingStore.find();
    if (existing.length === 0) {
      console.log('[Seed] Seeding sample wardrobe items...');
      for (const item of SAMPLE_WARDROBE_ITEMS) {
        await ClothingStore.create({ userId: 'demo-user-123', ...item });
      }
      console.log('[Seed] Sample wardrobe items seeded successfully!');
    }
  } catch (e) {
    console.error('[Seed Error]', e);
  }
}

module.exports = { seedData };
