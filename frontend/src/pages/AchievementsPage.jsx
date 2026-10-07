import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Award, Lock, CheckCircle2, Sparkles, Trophy } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAchievements().then(setAchievements).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zen-900/90 via-[#13251e] to-zen-900/90 border border-zen-600/40 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Achievement Sanctuary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Badges & Achievements
          </h1>
          <p className="text-xs sm:text-sm text-zen-300 mt-1 max-w-xl">
            Celebrate every milestone, streak, and hour spent cultivating mindful presence on your mat.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zen-950/70 px-5 py-3 rounded-2xl border border-zen-700/50">
          <Trophy className="w-8 h-8 text-amber-400" />
          <div>
            <span className="text-xs text-zen-400 block uppercase tracking-wider">Unlocked</span>
            <span className="text-2xl font-serif font-bold text-white font-mono">
              {unlockedCount} / {achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zen-400">Loading achievements...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                ach.is_unlocked
                  ? 'bg-gradient-to-b from-zen-900 to-[#12241d] border-amber-400/50 shadow-xl shadow-amber-500/10'
                  : 'bg-zen-950/50 border-zen-800/80 opacity-65'
              }`}
            >
              {ach.is_unlocked && (
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
              )}

              <div>
                {/* Badge Emoji & Status Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{ach.emoji}</span>
                  {ach.is_unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-zen-500 bg-zen-900 px-2.5 py-1 rounded-full border border-zen-800">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-zen-300 leading-relaxed font-light mb-4">
                  {ach.description}
                </p>
              </div>

              {/* Progress Meter */}
              <div className="pt-3 border-t border-zen-800/80">
                <div className="flex justify-between items-center text-[11px] text-zen-400 mb-1.5 font-mono">
                  <span>Progress</span>
                  <span className={ach.is_unlocked ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {ach.progress_value} / {ach.threshold_value}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zen-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      ach.is_unlocked ? 'bg-emerald-400' : 'bg-gradient-to-r from-zen-500 to-amber-400'
                    }`}
                    style={{ width: `${ach.progress_percentage}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
