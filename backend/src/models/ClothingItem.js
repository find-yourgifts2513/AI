const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'demo-user-123'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['top', 'bottom', 'footwear', 'accessory']
  },
  subCategory: {
    type: String,
    default: 'general'
  },
  dominantColors: [{
    hex: String,
    name: String,
    rgb: [Number]
  }],
  secondaryColors: [{
    hex: String,
    name: String,
    rgb: [Number]
  }],
  pattern: {
    type: String,
    enum: ['solid', 'striped', 'plaid', 'floral', 'polka_dots', 'graphic', 'checkered'],
    default: 'solid'
  },
  styleTags: [{
    type: String
  }],
  colorTemperature: {
    type: String,
    enum: ['warm', 'cool', 'neutral'],
    default: 'neutral'
  },
  vibrancy: {
    type: String,
    enum: ['vibrant', 'muted', 'pastel', 'dark'],
    default: 'muted'
  },
  wearCount: {
    type: Number,
    default: 0
  },
  lastWorn: {
    type: Date,
    default: null
  },
  favorite: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
