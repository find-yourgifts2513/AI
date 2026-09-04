const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnectedToMongo = false;
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_wardrobe', {
      serverSelectionTimeoutMS: 3000
    });
    isConnectedToMongo = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`[DB Storage] MongoDB connection unavailable. Switching to embedded local JSON store at ${dataDir}`);
  }
};

const getIsConnectedToMongo = () => isConnectedToMongo;

module.exports = { connectDB, getIsConnectedToMongo, dataDir };
