import React from 'react';
import { Sparkles, CheckCircle2, Award, Zap, Smile, Heart, Shield } from 'lucide-react';
import { incrementItemWear } from '../services/api';

export default function OutfitCard({ outfit, onWearOutfit }) {
  const { topItem, bottomItem, footwearItem, accessoryItem, harmonyScore, mood, occasion, explanation } = outfit;

  const handleWear = async () => {
    try {
      if (topItem) await incrementItemWear(topItem._id || topItem.id);
      if (bottomItem) await incrementItemWear(bottomItem._id || bottomItem.id);
      if (footwearItem) await incrementItemWear(footwearItem._id || footwearItem.id);
      if (accessoryItem) await incrementItemWear(accessoryItem._id || accessoryItem.id);

      if (onWearOutfit) onWearOutfit();
      alert('Outfit logged as worn today! Wear count updated.');
    } catch (e) {
      console.error(e);
    }
  };

  const moodIcon = {
    Energetic: Zap,
    Calm: Smile,
    Romantic: Heart,
    Confident: Shield
  }[mood] || Sparkles;

  const MoodIcon = moodIcon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300">
            <MoodIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm text-stone-800 dark:text-slate-100">{mood} Vibe</span>
              <span className="text-stone-300 dark:text-slate-600">•</span>
              <span className="text-xs font-semibold text-rose-500 dark:text-purple-400">{occasion}</span>
            </div>
          </div>
        </div>

        {/* Harmony Score Pill */}
        <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-sm">
          <Award className="w-3.5 h-3.5" />
          <span>{harmonyScore}% Harmony</span>
        </div>
      </div>

      {/* Outfit 4-Grid Pieces */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        
        {/* Top Item */}
        <div className="flex flex-col items-center bg-stone-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">Upper Top</span>
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 mb-2">
            <img src={topItem?.imageUrl} alt={topItem?.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-stone-700 dark:text-slate-200 line-clamp-1 text-center">
            {topItem?.name || 'Shirt'}
          </span>
        </div>

        {/* Bottom Item */}
        <div className="flex flex-col items-center bg-stone-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">Lower Bottom</span>
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 mb-2">
            <img src={bottomItem?.imageUrl} alt={bottomItem?.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-stone-700 dark:text-slate-200 line-clamp-1 text-center">
            {bottomItem?.name || 'Trousers'}
          </span>
        </div>

        {/* Footwear Item */}
        <div className="flex flex-col items-center bg-stone-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">Footwear</span>
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 mb-2">
            <img src={footwearItem?.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80'} alt="Footwear" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-stone-700 dark:text-slate-200 line-clamp-1 text-center">
            {footwearItem?.name || 'Matching Shoes'}
          </span>
        </div>

        {/* Accessory Item */}
        <div className="flex flex-col items-center bg-stone-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">Accessory</span>
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 mb-2">
            <img src={accessoryItem?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} alt="Accessory" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-stone-700 dark:text-slate-200 line-clamp-1 text-center">
            {accessoryItem?.name || 'Accent Accessory'}
          </span>
        </div>

      </div>

      {/* Explanation & Action Footer */}
      <div className="pt-3 border-t border-stone-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-stone-500 dark:text-slate-400 italic flex-1">
          "{explanation || 'Perfectly styled combination.'}"
        </p>

        <button
          onClick={handleWear}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 dark:bg-purple-600 text-white font-bold text-xs hover:bg-rose-600 dark:hover:bg-purple-500 transition-colors shadow-md flex items-center justify-center space-x-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Wear Today</span>
        </button>
      </div>

    </div>
  );
}
