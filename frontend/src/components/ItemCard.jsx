import React from 'react';
import { Tag, Sparkles, Heart, Trash2, CheckCircle2 } from 'lucide-react';
import { incrementItemWear, deleteWardrobeItem, resolveImageUrl } from '../services/api';

export default function ItemCard({ item, onDelete, onWearUpdated }) {
  const primaryColor = item.dominantColors?.[0] || { name: 'Color', hex: '#666' };

  const handleWear = async (e) => {
    e.stopPropagation();
    try {
      await incrementItemWear(item._id || item.id);
      if (onWearUpdated) onWearUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${item.name} from wardrobe?`)) {
      try {
        await deleteWardrobeItem(item._id || item.id);
        if (onDelete) onDelete(item._id || item.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const categoryEmoji = {
    top: '👔',
    bottom: '👖',
    footwear: '👟',
    accessory: '⌚'
  }[item.category] || '👕';

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 dark:bg-slate-900/50 overflow-hidden flex items-center justify-center">
        <img
          src={resolveImageUrl(item.imageUrl)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80';
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700 shadow-sm flex items-center space-x-1">
          <span>{categoryEmoji}</span>
          <span className="capitalize">{item.category}</span>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            title="Delete item"
            className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wear count pill */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-900/75 text-stone-100 backdrop-blur-sm">
          Worn {item.wearCount || 0}x
        </div>
      </div>

      {/* Item Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-bold text-sm text-stone-800 dark:text-slate-100 line-clamp-1 mb-1" title={item.name}>
            {item.name}
          </h4>

          {/* Color & Pattern badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-700/60 text-stone-700 dark:text-slate-300">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                style={{ backgroundColor: primaryColor.hex || '#333' }}
              />
              <span>{primaryColor.name || 'Color'}</span>
            </span>

            {item.pattern && item.pattern !== 'solid' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 capitalize">
                {item.pattern}
              </span>
            )}
          </div>
        </div>

        {/* Style tags & Wear button */}
        <div className="pt-2 border-t border-stone-100 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-hidden">
            {(item.styleTags || ['casual']).slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] uppercase font-semibold text-stone-400 dark:text-slate-500">
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleWear}
            className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-rose-50 dark:bg-slate-700 dark:hover:bg-purple-950 text-stone-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-purple-300 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Wore Today</span>
          </button>
        </div>

      </div>

    </div>
  );
}
