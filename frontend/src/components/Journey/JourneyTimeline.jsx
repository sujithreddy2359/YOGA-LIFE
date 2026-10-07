import React from 'react';
import { CheckCircle2, Lock, Flame, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JourneyTimeline({ journeyData }) {
  const milestones = journeyData?.milestones || [];
  const currentDays = journeyData?.current_practice_days || 0;
  const daysToNext = journeyData?.days_to_next_milestone || 0;
  const nextMilestoneDay = journeyData?.next_milestone_day || 1;

  return (
    <div className="space-y-8">
      {/* Progress Header Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zen-900/90 via-[#14261f] to-zen-900/90 border border-zen-600/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" /> 30-Day Transformation Path
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Your Yoga Journey
            </h2>
            <p className="text-sm text-zen-300 mt-1 max-w-xl">
              Progress through milestones unlocked exclusively by your consistent practice days.
            </p>
          </div>

          {/* Current Step Status */}
          <div className="flex items-center gap-4 bg-zen-950/60 px-5 py-3.5 rounded-2xl border border-zen-700/50">
            <div className="text-3xl">🌱</div>
            <div>
              <span className="text-xs text-zen-400 block uppercase tracking-wider">Practice Progress</span>
              <span className="text-xl font-bold text-white font-mono">
                Day {currentDays} / 30
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar toward next milestone */}
        <div className="mt-6 pt-5 border-t border-zen-800/80">
          <div className="flex justify-between items-center text-xs font-semibold text-zen-300 mb-2">
            <span>Next Milestone: Day {nextMilestoneDay}</span>
            <span className="text-amber-400">
              {daysToNext > 0 ? `${daysToNext} more practice day${daysToNext > 1 ? 's' : ''} to unlock` : 'Milestone Achieved!'}
            </span>
          </div>
          <div className="w-full h-3 bg-zen-950 rounded-full overflow-hidden border border-zen-700/40">
            <div
              className="h-full bg-gradient-to-r from-zen-500 via-emerald-400 to-amber-400 transition-all duration-700"
              style={{ width: `${journeyData?.progress_percentage || 5}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Milestones Timeline Grid / Path */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {milestones.map((m, idx) => {
          const isCurrent = currentDays < m.required_practice_days && (idx === 0 || currentDays >= milestones[idx - 1].required_practice_days);
          return (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border transition-all relative flex flex-col justify-between ${
                m.is_unlocked
                  ? 'bg-gradient-to-b from-zen-900/80 to-[#12231c] border-emerald-500/40 shadow-lg'
                  : isCurrent
                  ? 'bg-zen-900/90 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30'
                  : 'bg-zen-950/40 border-zen-800/60 opacity-60'
              }`}
            >
              <div>
                {/* Milestone Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{m.badge_emoji || '🌱'}</span>
                  {m.is_unlocked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                      <Flame className="w-3.5 h-3.5 animate-pulse" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-zen-500 bg-zen-900 px-2.5 py-1 rounded-full border border-zen-800">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-amber-400/90 uppercase tracking-widest block mb-1">
                  Day {m.day_number}
                </span>
                <h3 className="text-lg font-serif font-bold text-white mb-1">{m.title}</h3>
                <p className="text-xs text-zen-400 leading-relaxed mb-4">{m.description}</p>
              </div>

              {/* Reward Unlocked Box */}
              <div className="pt-3 border-t border-zen-800/80 mt-auto">
                <span className="text-[11px] font-semibold text-zen-300 block mb-0.5">
                  Reward Unlocks:
                </span>
                <p className="text-xs text-amber-300/90 font-medium">
                  {m.unlock_reward_title || 'New Flows & Badges'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
