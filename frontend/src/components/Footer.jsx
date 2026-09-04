import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-stone-500 dark:text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-stone-700 dark:text-slate-300">AI Wardrobe</span>
          <span>— Intelligent Computer Vision & Dynamic Styling Engine</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for Fashion Tech</span>
        </div>
      </div>
    </footer>
  );
}
