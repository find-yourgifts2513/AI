import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Sparkles, AlertCircle, Heart, Trophy } from 'lucide-react';
import { getAnalyticsStats } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Wardrobe Intelligence & Usage Metrics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-slate-100 tracking-tight">
          Wardrobe Analytics
        </h1>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
          Track wear frequencies, discover under-utilized clothing pieces ("Forgotten Gems"), and review your highest-rated outfit combinations.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items in Wardrobe', value: stats?.totalItems || 10, icon: Sparkles, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/50' },
          { label: 'Forgotten Gems (<2 Wears)', value: stats?.forgottenGems?.length || 3, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/50' },
          { label: 'Most Loved Outfits', value: stats?.topCombinations?.length || 2, icon: Heart, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/50' },
          { label: 'Top Worn Item Count', value: `${stats?.mostWornItems?.[0]?.wearCount || 15} Wears`, icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-stone-800 dark:text-slate-100">{m.value}</div>
                <div className="text-[11px] text-stone-400 font-semibold">{m.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Breakdown & Dominant Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Progress */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-purple-500" />
            <span>Category Ratio Distribution</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Tops (Upper Wear)', count: stats?.categoryCounts?.top || 4, percent: 40, color: 'bg-rose-500' },
              { label: 'Bottoms (Lower Wear)', count: stats?.categoryCounts?.bottom || 2, percent: 20, color: 'bg-indigo-500' },
              { label: 'Footwear', count: stats?.categoryCounts?.footwear || 2, percent: 20, color: 'bg-amber-500' },
              { label: 'Accessories', count: stats?.categoryCounts?.accessory || 2, percent: 20, color: 'bg-emerald-500' },
            ].map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-slate-300">
                  <span>{c.label}</span>
                  <span>{c.count} items ({c.percent}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Dominant Color Palette Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats?.colorCounts || { 'Navy Blue': 3, 'Mustard Yellow': 2, 'Pure White': 2, 'Classic Black': 3 }).map(([colorName, count], idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-100 dark:border-slate-700">
                <span className="text-xs font-bold text-stone-700 dark:text-slate-300">{colorName}</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-slate-700 text-stone-800 dark:text-slate-100">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Forgotten Gems Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span>Under-Used Pieces ("Forgotten Gems")</span>
        </h3>
        <p className="text-xs text-stone-400">
          The AI recommends pairing these items in your next outfit generation to maximize wardrobe sustainability and usage efficiency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(stats?.forgottenGems || []).map((item, idx) => (
            <ItemCard key={idx} item={item} onWearUpdated={loadStats} />
          ))}
        </div>
      </div>

    </div>
  );
}
