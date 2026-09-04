const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ClothingStore } = require('../models/localStore');
const { protect } = require('../middleware/authMiddleware');
const { analyzeUploadedImage } = require('../services/imageTaggingService');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Upload item & Auto-tag with AI
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    let filename = req.file ? req.file.filename : '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
      filename = req.body.name || 'item.jpg';
    } else {
      return res.status(400).json({ message: 'Image file or image URL is required' });
    }

    const categoryHint = req.body.category || null;

    // AI Auto-Tagging
    const aiTags = await analyzeUploadedImage(req.file ? req.file.path : '', categoryHint, filename || req.body.name || '');

    const name = req.body.name || `${aiTags.dominantColors[0]?.name || 'Stylish'} ${aiTags.subCategory.replace('_', ' ')}`;

    const newItemData = {
      userId: req.user.id,
      name,
      category: req.body.category || aiTags.category,
      subCategory: req.body.subCategory || aiTags.subCategory,
      dominantColors: aiTags.dominantColors,
      secondaryColors: aiTags.secondaryColors,
      pattern: req.body.pattern || aiTags.pattern,
      styleTags: req.body.styleTags ? (Array.isArray(req.body.styleTags) ? req.body.styleTags : req.body.styleTags.split(',')) : aiTags.styleTags,
      colorTemperature: aiTags.colorTemperature,
      vibrancy: aiTags.vibrancy,
      wearCount: 0,
      favorite: false,
      imageUrl
    };

    const savedItem = await ClothingStore.create(newItemData);

    res.status(201).json({
      message: 'Item uploaded and auto-tagged successfully by AI!',
      item: savedItem,
      aiAnalysis: aiTags
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all wardrobe items for user
router.get('/', protect, async (req, res) => {
  try {
    const { category, pattern, mood, occasion } = req.query;
    let items = await ClothingStore.find();

    if (category) {
      items = items.filter(item => item.category === category);
    }
    if (pattern) {
      items = items.filter(item => item.pattern === pattern);
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single item by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await ClothingStore.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Clothing item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment wear count (when user wears this item)
router.post('/:id/wear', protect, async (req, res) => {
  try {
    const updated = await ClothingStore.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { wearCount: 1 },
        $set: { lastWorn: new Date().toISOString() }
      }
    );
    res.json({ message: 'Wear count updated', item: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle Favorite status
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const item = await ClothingStore.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const updated = await ClothingStore.findByIdAndUpdate(
      req.params.id,
      { $set: { favorite: !item.favorite } }
    );
    res.json({ message: 'Favorite updated', item: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete item
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await ClothingStore.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
