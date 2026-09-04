import React, { useState } from 'react';
import { Upload, X, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadWardrobeItem } from '../services/api';

export default function UploadModal({ isOpen, onClose, onItemUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [category, setCategory] = useState('top');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !previewUrl) return;

    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }
      formData.append('category', category);
      if (name) formData.append('name', name);

      const res = await uploadWardrobeItem(formData);
      setAiAnalysis(res.aiAnalysis);

      setTimeout(() => {
        setLoading(false);
        if (onItemUploaded) onItemUploaded(res.item);
        handleClose();
      }, 600);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl('');
    setName('');
    setCategory('top');
    setAiAnalysis(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-700 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-purple-950 text-rose-600 dark:text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-800 dark:text-slate-100">Add Wardrobe Item</h3>
              <p className="text-xs text-stone-400 dark:text-slate-400">AI auto-detects colors, pattern & style</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* File Upload Box */}
          <div className="relative border-2 border-dashed border-stone-300 dark:border-slate-600 rounded-2xl p-6 text-center hover:border-rose-400 dark:hover:border-purple-400 transition-colors">
            {previewUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-slate-900 flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="max-h-48 object-contain" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreviewUrl(''); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-purple-950/60 flex items-center justify-center text-rose-500 dark:text-purple-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-stone-700 dark:text-slate-200">
                  Click to upload image file
                </div>
                <span className="text-[10px] text-stone-400">Supports JPG, PNG, WEBP</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
              Category Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'top', label: 'Upper Top 👔' },
                { id: 'bottom', label: 'Lower Bottom 👖' },
                { id: 'footwear', label: 'Footwear 👟' },
                { id: 'accessory', label: 'Accessory ⌚' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                    category === cat.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                      : 'border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name optional */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
              Item Name (Optional - AI will auto-name if blank)
            </label>
            <input
              type="text"
              placeholder="e.g. Vintage Blue Denim Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || (!file && !previewUrl)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Extracting Colors & Tags...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Auto-Tag & Save to Wardrobe</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
