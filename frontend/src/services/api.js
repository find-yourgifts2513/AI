import axios from 'axios';

const API_BASE = 'https://ai-wardrobe-3wpo.onrender.com/api';

export const fetchWardrobeItems = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/wardrobe`, { params });
  return res.data;
};

export const uploadWardrobeItem = async (formData) => {
  const res = await axios.post(`${API_BASE}/wardrobe/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteWardrobeItem = async (id) => {
  const res = await axios.delete(`${API_BASE}/wardrobe/${id}`);
  return res.data;
};

export const incrementItemWear = async (id) => {
  const res = await axios.post(`${API_BASE}/wardrobe/${id}/wear`);
  return res.data;
};

export const generateOutfitRecommendations = async (mood, occasion) => {
  const res = await axios.post(`${API_BASE}/recommendations/generate`, { mood, occasion });
  return res.data;
};

export const analyzeSkinTone = async (formData) => {
  const res = await axios.post(`${API_BASE}/skin-tone/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getSkinProfile = async () => {
  const res = await axios.get(`${API_BASE}/skin-tone/profile`);
  return res.data;
};

export const getTodayOutfit = async () => {
  const res = await axios.get(`${API_BASE}/scheduler/today`);
  return res.data;
};

export const refreshTodayOutfit = async () => {
  const res = await axios.post(`${API_BASE}/scheduler/refresh`);
  return res.data;
};

export const getSchedulerHistory = async () => {
  const res = await axios.get(`${API_BASE}/scheduler/history`);
  return res.data;
};

export const getAnalyticsStats = async () => {
  const res = await axios.get(`${API_BASE}/analytics/stats`);
  return res.data;
};
