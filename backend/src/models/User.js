const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  skinToneProfile: {
    undertone: { type: String, enum: ['warm', 'cool', 'neutral', 'olive'], default: null },
    complexion: { type: String, enum: ['fair', 'medium', 'tan', 'deep'], default: null },
    recommendedColors: [String],
    avoidColors: [String],
    lastUpdated: Date
  },
  preferences: {
    preferredTheme: { type: String, default: 'pastel' },
    defaultOccasion: { type: String, default: 'College' },
    defaultMood: { type: String, default: 'Energetic' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
