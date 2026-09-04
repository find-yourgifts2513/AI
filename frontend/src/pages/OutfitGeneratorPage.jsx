import React, { useState, useEffect } from 'react';
import { Wand2, Zap, Smile, Heart, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { generateOutfitRecommendations } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import OutfitCard from '../components/OutfitCard';

export default function OutfitGeneratorPage() {
  const [selectedMood, setSelectedMood] = useState('Energetic');
  const [selectedOccasion, setSelectedOccasion] = useState('College');
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setActiveMoodTheme } = useTheme();

  useEffect(() => {
    handleGenerate(selectedMood, selectedOccasion);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setActiveMoodTheme(mood);
    handleGenerate(mood, selectedOccasion);
  };

  const handleOccasionSelect = (occ) => {
    setSelectedOccasion(occ);
    handleGenerate(selectedMood, occ);
  };

  const handleGenerate = async (mood, occ) => {
    setLoading(true);
    try {
      const data = await generateOutfitRecommendations(mood, occ);
      setOutfits(data.recommendations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const moodButtons = [
    { id: 'Energetic', label: 'Energetic', desc: 'Vibrant, warm dynamic contrast', icon: Zap, color: 'from-amber-500 to-orange-500' },
    { id: 'Calm', label: 'Calm', desc: 'Soft ocean, muted & peaceful', icon: Smile, color: 'from-cyan-500 to-blue-500' },
    { id: 'Romantic', label: 'Romantic', desc: 'Soft pinks & warm pastels', icon: Heart, color: 'from-rose-500 to-pink-500' },
    { id: 'Confident', label: 'Confident', desc: 'Bold darks & high-value contrast', icon: Shield, color: 'from-purple-600 to-indigo-600' }
  ];

  const occasionButtons = [
    { id: 'College', label: 'College', desc: 'Neat casuals, polo/shirts, denim & sneakers', emoji: '🎓' },
    { id: 'Office', label: 'Office', desc: 'Smart formal shirts, trousers & loafers', emoji: '💼' },
    { id: 'Party', label: 'Party', desc: 'Stylish contrasts & statement accessories', emoji: '🎉' },
    { id: 'Traditional', label: 'Traditional', desc: 'Ethnic kurtas & traditional pairings', emoji: '🥻' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Dynamic Styling Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-slate-100 tracking-tight">
          AI Outfit Recommendation Studio
        </h1>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
          Select your desired Mood and Occasion mode. The AI calculates real-time color harmony and design compatibility.
        </p>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mood Selector */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>1. Mood-Based Styling</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {moodButtons.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-r ${m.color} text-white border-transparent shadow-lg shadow-rose-500/20 scale-[1.02]`
                      : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                    {isSelected && <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/20">Active</span>}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">{m.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-stone-400 dark:text-slate-500'}`}>
                      {m.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Occasion Selector */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>2. Occasion Mode</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {occasionButtons.map((o) => {
              const isSelected = selectedOccasion === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => handleOccasionSelect(o.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-purple-600 text-white border-stone-900 dark:border-purple-600 shadow-lg scale-[1.02]'
                      : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xl mb-1">{o.emoji}</div>
                  <div>
                    <div className="font-extrabold text-sm">{o.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-stone-300 dark:text-purple-200' : 'text-stone-400 dark:text-slate-500'}`}>
                      {o.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Generated Outfits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-stone-800 dark:text-slate-100 flex items-center space-x-2">
            <span>AI Suggested Outfits</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-purple-950 text-rose-700 dark:text-purple-300">
              {outfits.length} Styled Combos
            </span>
          </h2>

          <button
            onClick={() => handleGenerate(selectedMood, selectedOccasion)}
            disabled={loading}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-calculate</span>
          </button>
        </div>

        {outfits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outfits.map((outfit, idx) => (
              <OutfitCard key={idx} outfit={outfit} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-dashed border-stone-200 dark:border-slate-700">
            <Wand2 className="w-10 h-10 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700 dark:text-slate-300">No complete outfits found</p>
            <p className="text-xs text-stone-400 mt-1">Please ensure you have at least 1 top item and 1 bottom item in your wardrobe.</p>
          </div>
        )}
      </div>

    </div>
  );
}
