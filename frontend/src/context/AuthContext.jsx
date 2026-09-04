import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'demo-user-123',
    username: 'DemoStylist',
    email: 'demo@aiwardrobe.com',
    skinToneProfile: null
  });
  const [token, setToken] = useState(localStorage.getItem('ai_wardrobe_token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('ai_wardrobe_token', res.data.token);
      return res.data;
    } catch (e) {
      console.warn('Login fallback to demo user');
      return { user };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('ai_wardrobe_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
