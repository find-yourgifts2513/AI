const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { seedData } = require('./data/seedData');
const { initDailyOutfitScheduler } = require('./scheduler/dailyOutfitCron');

// Route imports
const authRoutes = require('./routes/authRoutes');
const wardrobeRoutes = require('./routes/wardrobeRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const skinToneRoutes = require('./routes/skinToneRoutes');
const schedulerRoutes = require('./routes/schedulerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/skin-tone', skinToneRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'AI Wardrobe Server',
    time: new Date().toISOString()
  });
});

// Boot server & DB
const startServer = async () => {
  await connectDB();
  await seedData();
  initDailyOutfitScheduler();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AI Wardrobe Backend API running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer();
