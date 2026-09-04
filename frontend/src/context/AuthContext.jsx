import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_DOMAIN = 'https://ai-wardrobe-3wpo.onrender.com';
const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || `${BACKEND_DOMAIN}/api`).replace(/\/api\/?$/, '') + '/api';

const DEMO_USER = {
  id: 'demo-user-123',
  username: 'DemoStylist',
  email: 'demo@aiwardrobe.com',
  skinToneProfile: null
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ai_wardrobe_user');
    if (!savedUser) return DEMO_USER;

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      return DEMO_USER;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('ai_wardrobe_token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('ai_wardrobe_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('ai_wardrobe_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('ai_wardrobe_user', JSON.stringify(user));
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('ai_wardrobe_token', res.data.token);
      localStorage.setItem('ai_wardrobe_user', JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      // If user doesn't exist yet, attempt registration automatically
      if (err.response?.status === 400 || err.response?.status === 404) {
        const username = email.split('@')[0] || 'User';
        return await register(username, email, password);
      }
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { username, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('ai_wardrobe_token', res.data.token);
      localStorage.setItem('ai_wardrobe_user', JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      // Fallback demo user if network error
      const customUser = { id: 'user_' + Date.now(), username: username || 'Stylist', email, skinToneProfile: null };
      setUser(customUser);
      setToken('demo_token_' + Date.now());
      return { user: customUser };
    }
  };

  const loginAsGuest = () => {
    setUser(DEMO_USER);
    setToken('guest_token_123');
  };

  const logout = () => {
    setToken(null);
    setUser(DEMO_USER);
    localStorage.removeItem('ai_wardrobe_token');
    localStorage.setItem('ai_wardrobe_user', JSON.stringify(DEMO_USER));
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
