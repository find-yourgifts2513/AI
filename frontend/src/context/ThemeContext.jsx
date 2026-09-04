import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 'pastel' | 'galaxy'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('ai_wardrobe_theme') || 'pastel';
  });

  // 'none' | 'Energetic' | 'Calm' | 'Romantic' | 'Confident'
  const [activeMoodTheme, setActiveMoodTheme] = useState('none');

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'galaxy') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ai_wardrobe_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'pastel' ? 'galaxy' : 'pastel'));
  };

  const getBackgroundGradient = () => {
    if (activeMoodTheme === 'Energetic') {
      return themeMode === 'galaxy'
        ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900'
        : 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50';
    }
    if (activeMoodTheme === 'Calm') {
      return themeMode === 'galaxy'
        ? 'bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900'
        : 'bg-gradient-to-br from-sky-50 via-teal-50 to-blue-50';
    }
    if (activeMoodTheme === 'Romantic') {
      return themeMode === 'galaxy'
        ? 'bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900'
        : 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50';
    }
    if (activeMoodTheme === 'Confident') {
      return themeMode === 'galaxy'
        ? 'bg-gradient-to-br from-slate-950 via-indigo-950/60 to-purple-950'
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100';
    }

    // Default themes
    return themeMode === 'galaxy'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-stone-50 text-stone-800';
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleTheme,
        activeMoodTheme,
        setActiveMoodTheme,
        getBackgroundGradient
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
