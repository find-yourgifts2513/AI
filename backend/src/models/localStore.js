const fs = require('fs');
const path = require('path');
const { getIsConnectedToMongo, dataDir } = require('../config/db');

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
};

const writeCollection = (collection, items) => {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
};

class LocalStore {
  constructor(collectionName, MongooseModel) {
    this.collectionName = collectionName;
    this.MongooseModel = MongooseModel;
  }

  async find(query = {}) {
    if (getIsConnectedToMongo()) {
      return await this.MongooseModel.find(query);
    }
    const items = readCollection(this.collectionName);
    return items.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findById(id) {
    if (getIsConnectedToMongo()) {
      return await this.MongooseModel.findById(id);
    }
    const items = readCollection(this.collectionName);
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async findOne(query = {}) {
    if (getIsConnectedToMongo()) {
      return await this.MongooseModel.findOne(query);
    }
    const items = await this.find(query);
    return items[0] || null;
  }

  async create(data) {
    if (getIsConnectedToMongo()) {
      const doc = new this.MongooseModel(data);
      return await doc.save();
    }
    const items = readCollection(this.collectionName);
    const newItem = {
      _id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      wearCount: 0,
      createdAt: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    writeCollection(this.collectionName, items);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (getIsConnectedToMongo()) {
      return await this.MongooseModel.findByIdAndUpdate(id, updateData, { new: true, ...options });
    }
    const items = readCollection(this.collectionName);
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const currentItem = items[index];
    const updatedItem = { ...currentItem };

    if (updateData.$inc) {
      for (const k in updateData.$inc) {
        updatedItem[k] = (updatedItem[k] || 0) + updateData.$inc[k];
      }
    }
    if (updateData.$set) {
      Object.assign(updatedItem, updateData.$set);
    }
    for (const k in updateData) {
      if (!k.startsWith('$')) {
        updatedItem[k] = updateData[k];
      }
    }

    items[index] = updatedItem;
    writeCollection(this.collectionName, items);
    return updatedItem;
  }

  async findByIdAndDelete(id) {
    if (getIsConnectedToMongo()) {
      return await this.MongooseModel.findByIdAndDelete(id);
    }
    let items = readCollection(this.collectionName);
    const removed = items.find(item => item._id === id || item.id === id);
    items = items.filter(item => item._id !== id && item.id !== id);
    writeCollection(this.collectionName, items);
    return removed;
  }
}

const ClothingItemModel = require('./ClothingItem');
const UserModel = require('./User');
const DailyOutfitModel = require('./DailyOutfit');

module.exports = {
  ClothingStore: new LocalStore('clothing_items', ClothingItemModel),
  UserStore: new LocalStore('users', UserModel),
  DailyOutfitStore: new LocalStore('daily_outfits', DailyOutfitModel)
};
