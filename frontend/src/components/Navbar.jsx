import React from 'react';
import { Sparkles, Shirt, Wand2, User, Calendar, BarChart3, Camera, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { themeMode, toggleTheme, activeMoodTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
    { id: 'generator', label: 'Outfit AI', icon: Wand2 },
    { id: 'skintone', label: 'Skin Tone', icon: User },
    { id: 'scheduler', label: 'Daily Push', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tryon', label: 'WebAR Try-On', icon: Camera },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-stone-200/60 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-500 to-amber-400 p-0.5 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-500 dark:text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 dark:from-rose-400 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
                AI Wardrobe
              </span>
              <span className="block text-[10px] font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-widest -mt-1">
                Fashion Vision AI
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-50 dark:bg-purple-950/60 text-rose-600 dark:text-purple-300 shadow-sm border border-rose-200/50 dark:border-purple-800/50'
                      : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500 dark:text-purple-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Theme Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Active Mood Pill */}
            {activeMoodTheme !== 'none' && (
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800 animate-pulse">
                <span>Mood: {activeMoodTheme}</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-100/80 dark:bg-slate-800/80 px-2.5 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 text-xs font-black text-white">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] font-bold text-stone-500 dark:text-slate-400">Signed in</div>
                <div className="text-[11px] font-semibold text-stone-800 dark:text-slate-200">{user?.username || 'Stylist'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-100/80 dark:bg-slate-800/80 text-stone-700 dark:text-slate-200 hover:scale-105 transition-transform"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${themeMode === 'pastel' ? 'Galaxy Dark' : 'Pastel Light'} Theme`}
              className="p-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-100/80 dark:bg-slate-800/80 text-stone-700 dark:text-slate-200 hover:scale-105 transition-transform"
            >
              {themeMode === 'pastel' ? (
                <Moon className="w-4 h-4 text-purple-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 dark:border-slate-800 py-2 px-2 bg-white/90 dark:bg-slate-900/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`p-2 rounded-lg flex flex-col items-center text-[10px] font-medium ${
                isActive ? 'text-rose-600 dark:text-purple-400 font-bold' : 'text-stone-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
