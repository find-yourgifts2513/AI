import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { getTodayOutfit, refreshTodayOutfit, getSchedulerHistory } from '../services/api';
import OutfitCard from '../components/OutfitCard';

export default function SchedulerPage() {
  const [todayOutfit, setTodayOutfit] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSchedulerData();
  }, []);

  const loadSchedulerData = async () => {
    setLoading(true);
    try {
      const today = await getTodayOutfit();
      setTodayOutfit(today);
      const hist = await getSchedulerHistory();
      setHistory(hist || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToday = async () => {
    setRefreshing(true);
    try {
      const res = await refreshTodayOutfit();
      setTodayOutfit(res.outfit);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-purple-950 text-rose-700 dark:text-purple-300 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Automated Daily Push Scheduler</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-800 dark:text-slate-100 tracking-tight">
            Daily Outfit Suggestions
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Cron job service runs daily at midnight to select your optimal outfit of the day based on mood & style variety.
          </p>
        </div>

        <button
          onClick={handleRefreshToday}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-2xl bg-stone-900 dark:bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-rose-600 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Regenerate Today's Push</span>
        </button>
      </div>

      {/* Today's Card */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-stone-800 dark:text-slate-100 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Today's Outfit Suggestion ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})</span>
        </h2>

        {todayOutfit ? (
          <OutfitCard outfit={todayOutfit} onWearOutfit={loadSchedulerData} />
        ) : (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-dashed border-stone-200 dark:border-slate-700">
            <Clock className="w-10 h-10 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-600 dark:text-slate-300">No outfit generated for today yet.</p>
          </div>
        )}
      </div>

      {/* Scheduler History List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-stone-800 dark:text-slate-100 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <span>Past Outfit Push History ({history.length} days logged)</span>
        </h2>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((outfit, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-stone-100 dark:bg-slate-900 text-stone-800 dark:text-slate-200 font-extrabold text-xs text-center">
                    <div>{outfit.date}</div>
                    <div className="text-[10px] text-rose-500 uppercase font-semibold">{outfit.mood}</div>
                  </div>

                  <div>
                    <div className="font-extrabold text-sm text-stone-800 dark:text-slate-100">
                      {outfit.topItem?.name || 'Top'} + {outfit.bottomItem?.name || 'Bottom'}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      Occasion: {outfit.occasion} • Harmony Score: {outfit.harmonyScore}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Scheduled & Logged</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">No past schedule history found yet.</p>
        )}
      </div>

    </div>
  );
}
