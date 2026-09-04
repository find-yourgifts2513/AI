import React, { useState, useEffect } from 'react';
import { Shirt, Plus, Search, Filter, Sparkles } from 'lucide-react';
import { fetchWardrobeItems } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function WardrobePage({ onOpenUpload }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePattern, setActivePattern] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchWardrobeItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (activePattern !== 'all' && item.pattern !== activePattern) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(q);
      const colorMatch = item.dominantColors?.some(c => c.name?.toLowerCase().includes(q));
      if (!nameMatch && !colorMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-800 dark:text-slate-100 flex items-center space-x-2">
            <Shirt className="w-7 h-7 text-rose-500" />
            <span>Wardrobe Inventory</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Auto-tagged with OpenCV & Computer Vision ({items.length} total items)
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        
        {/* Top Controls: Search Input & Category Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Items ✨' },
              { id: 'top', label: 'Tops 👔' },
              { id: 'bottom', label: 'Bottoms 👖' },
              { id: 'footwear', label: 'Footwear 👟' },
              { id: 'accessory', label: 'Accessories ⌚' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search color, name, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

        </div>

        {/* Pattern Filter Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-stone-100 dark:border-slate-700/60 text-xs">
          <span className="font-bold text-stone-400 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Pattern:</span>
          </span>
          {['all', 'solid', 'striped', 'plaid', 'floral', 'polka_dots'].map(pat => (
            <button
              key={pat}
              onClick={() => setActivePattern(pat)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize text-[11px] ${
                activePattern === pat
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:text-slate-400'
              }`}
            >
              {pat.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Wardrobe Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <ItemCard
              key={item._id || item.id}
              item={item}
              onDelete={loadItems}
              onWearUpdated={loadItems}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-dashed border-stone-200 dark:border-slate-700">
          <Sparkles className="w-10 h-10 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-stone-700 dark:text-slate-300 text-base">No items match your filter</h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">Try clearing filters or upload a new item.</p>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
          >
            Upload Item Now
          </button>
        </div>
      )}

    </div>
  );
}
