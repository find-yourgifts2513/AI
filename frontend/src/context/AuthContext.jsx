import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('ai_wardrobe_token', res.data.token);
    localStorage.setItem('ai_wardrobe_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await axios.post('/api/auth/register', { username, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('ai_wardrobe_token', res.data.token);
    localStorage.setItem('ai_wardrobe_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(DEMO_USER);
    localStorage.removeItem('ai_wardrobe_token');
    localStorage.setItem('ai_wardrobe_user', JSON.stringify(DEMO_USER));
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
