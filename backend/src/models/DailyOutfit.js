const mongoose = require('mongoose');

const dailyOutfitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'demo-user-123'
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  topItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  bottomItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  footwearItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  watchItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  accessoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  mood: {
    type: String,
    enum: ['Energetic', 'Calm', 'Romantic', 'Confident'],
    default: 'Energetic'
  },
  occasion: {
    type: String,
    enum: ['College', 'Office', 'Party', 'Traditional'],
    default: 'College'
  },
  harmonyScore: {
    type: Number,
    default: 85
  },
  explanation: {
    type: String,
    default: ''
  },
  accepted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyOutfit', dailyOutfitSchema);
