import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, Wand2, Calendar, User, ArrowRight, Shirt, RefreshCw } from 'lucide-react';
import { getTodayOutfit, getAnalyticsStats } from '../services/api';
import OutfitCard from '../components/OutfitCard';
import ItemCard from '../components/ItemCard';

export default function DashboardPage({ setActivePage, onOpenUpload }) {
  const [todayOutfit, setTodayOutfit] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const outfit = await getTodayOutfit();
      setTodayOutfit(outfit);
      const st = await getAnalyticsStats();
      setStats(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Wardrobe Vision Engine 2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Elevate Your Style with Dynamic AI Harmony
          </h1>
          <p className="text-rose-100 text-sm sm:text-base mb-6 leading-relaxed">
            Auto-tag clothing colors and patterns, get mood & occasion-matched outfit pairings, match your skin undertone, and track your wardrobe analytics.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenUpload}
              className="px-5 py-3 rounded-2xl bg-white text-stone-900 font-bold text-xs shadow-lg hover:bg-stone-100 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 text-rose-500" />
              <span>Upload New Item</span>
            </button>
            <button
              onClick={() => setActivePage('generator')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/20 transition-colors flex items-center space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate Outfit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Auto-Pushed Outfit Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-extrabold text-stone-800 dark:text-slate-100">
              Outfit of the Day (Daily AI Push)
            </h2>
          </div>
          <button
            onClick={() => setActivePage('scheduler')}
            className="text-xs font-bold text-rose-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
          >
            <span>View Schedule History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayOutfit ? (
          <OutfitCard outfit={todayOutfit} onWearOutfit={loadDashboardData} />
        ) : (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-dashed border-stone-200 dark:border-slate-700">
            <Shirt className="w-10 h-10 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-600 dark:text-slate-300">No outfit generated for today yet</p>
            <p className="text-xs text-stone-400 mb-4">Upload tops and bottoms to enable daily suggestions.</p>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
            >
              Upload Wardrobe Items
            </button>
          </div>
        )}
      </div>

      {/* Wardrobe Quick Stats & Forgotten Gems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Distribution Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base mb-4">
              Wardrobe Inventory Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Tops (Upper)', count: stats?.categoryCounts?.top || 4, emoji: '👔', color: 'bg-rose-500' },
                { label: 'Bottoms (Lower)', count: stats?.categoryCounts?.bottom || 2, emoji: '👖', color: 'bg-indigo-500' },
                { label: 'Footwear', count: stats?.categoryCounts?.footwear || 2, emoji: '👟', color: 'bg-amber-500' },
                { label: 'Accessories', count: stats?.categoryCounts?.accessory || 2, emoji: '⌚', color: 'bg-emerald-500' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-2 font-semibold text-stone-700 dark:text-slate-300">
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </span>
                  <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-700 text-stone-800 dark:text-slate-200">
                    {c.count} items
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('wardrobe')}
            className="mt-6 w-full py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors"
          >
            Explore Wardrobe Grid
          </button>
        </div>

        {/* Forgotten Gems Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base">
                Forgotten Gems (Under-Used Pieces)
              </h3>
              <p className="text-xs text-stone-400">Items waiting for your next outfit pairing</p>
            </div>
            <button
              onClick={() => setActivePage('analytics')}
              className="text-xs font-bold text-rose-500 hover:underline"
            >
              View Analytics
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(stats?.forgottenGems || []).slice(0, 4).map((item, idx) => (
              <ItemCard key={idx} item={item} onWearUpdated={loadDashboardData} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
