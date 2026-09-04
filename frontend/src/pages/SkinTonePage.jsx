import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, CheckCircle2, AlertCircle, RefreshCw, User } from 'lucide-react';
import { analyzeSkinTone, getSkinProfile } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function SkinTonePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [profile, setProfile] = useState(null);
  const [matchingItems, setMatchingItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getSkinProfile();
      if (res.profile) {
        setProfile(res.profile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelfieUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('selfie', selected);

      const res = await analyzeSkinTone(formData);
      setProfile(res.profile);
      setMatchingItems(res.matchingWardrobeItems || []);
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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-purple-950 text-rose-700 dark:text-purple-300 text-xs font-bold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Skin Complexion & Undertone AI</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-slate-100 tracking-tight">
          Skin Tone Palette Matching
        </h1>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
          Upload a selfie photo. OpenCV extracts your melanin index and LAB color undertone to recommend clothing colors that enhance your complexion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Selfie Upload & Scanner */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-base mb-4 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-rose-500" />
              <span>Selfie Scan</span>
            </h3>

            <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-stone-300 dark:border-slate-600 overflow-hidden flex flex-col items-center justify-center p-4 bg-stone-50 dark:bg-slate-900 text-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Selfie preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-purple-950 flex items-center justify-center text-rose-500">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-stone-700 dark:text-slate-200">
                    Click to upload selfie
                  </span>
                  <span className="text-[10px] text-stone-400">Ensures facial skin region sampling</span>
                  <input type="file" accept="image/*" onChange={handleSelfieUpload} className="hidden" />
                </label>
              )}

              {loading && (
                <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs font-bold space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-rose-400" />
                  <span>Analyzing Skin LAB Color Space...</span>
                </div>
              )}
            </div>
          </div>

          <label className="mt-4 w-full py-3 rounded-2xl bg-stone-900 dark:bg-purple-600 text-white font-bold text-xs text-center cursor-pointer hover:bg-rose-600 transition-colors block">
            <span>{previewUrl ? 'Scan Different Photo' : 'Upload Selfie Photo'}</span>
            <input type="file" accept="image/*" onChange={handleSelfieUpload} className="hidden" />
          </label>
        </div>

        {/* Skin Profile Result Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-lg">
                Your Skin Tone Profile
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
                {profile?.undertone || 'Golden Warm'} Undertone
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-2 leading-relaxed">
              {profile?.description || 'Your golden peach undertone pairs beautifully with warm earth tones, deep crimson, mustard yellow, and ivory.'}
            </p>
          </div>

          {/* Recommended Color Hex Chips */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              ✨ Recommended Complementary Color Palette
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(profile?.recommendedColors || [
                { name: 'Mustard Yellow', hex: '#FFDB58' },
                { name: 'Olive Green', hex: '#556B2F' },
                { name: 'Warm Terracotta', hex: '#E2725B' },
                { name: 'Coral Pink', hex: '#FF7F50' },
                { name: 'Cream / Ivory', hex: '#FFFDD0' },
                { name: 'Burgundy', hex: '#800020' }
              ]).map((c, idx) => {
                const hex = typeof c === 'string' ? c : c.hex;
                const name = typeof c === 'string' ? c : c.name;
                return (
                  <div key={idx} className="flex items-center space-x-2 p-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-100 dark:border-slate-700">
                    <span className="w-5 h-5 rounded-full border border-black/10 shadow-sm inline-block" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-bold text-stone-700 dark:text-slate-300 line-clamp-1">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Avoid Colors */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1 text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Colors to Avoid or Balance</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-500 dark:text-slate-400">
              {(profile?.avoidColors || ['Icy Blue', 'Stark Magenta', 'Neon Lime']).map((ac, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300">
                  🚫 {ac}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Wardrobe Items matching skin tone */}
      {matchingItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-stone-800 dark:text-slate-100 text-lg flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Existing Wardrobe Pieces Complementing Your Skin Tone</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {matchingItems.map((item, idx) => (
              <ItemCard key={idx} item={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
