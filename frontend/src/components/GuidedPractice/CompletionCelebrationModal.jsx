import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, Flame, ArrowRight, Heart, CheckCircle2, Trophy } from 'lucide-react';

export default function CompletionCelebrationModal({
  sessionResult,
  onSaveAndClose,
  onViewProgress,
  onContinueJourney
}) {
  const [mood, setMood] = useState('Relaxed');
  const [energyLevel, setEnergyLevel] = useState(8);
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti cannons
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#679882', '#fbbf24', '#f59e0b', '#34d399', '#ffffff']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const moodOptions = [
    { label: 'Great', emoji: '😊' },
    { label: 'Good', emoji: '🙂' },
    { label: 'Relaxed', emoji: '😌' },
    { label: 'Okay', emoji: '😐' },
    { label: 'Tired', emoji: '😴' },
  ];

  const handleSave = async (redirectTarget = 'dashboard') => {
    setIsSubmitting(true);
    await onSaveAndClose({
      mood,
      energy_level: energyLevel,
      notes: reflectionNote
    }, redirectTarget);
    setIsSubmitting(false);
  };

  const unlockedMilestones = sessionResult?.newly_unlocked_milestones || [];
  const unlockedAchievements = sessionResult?.newly_unlocked_achievements || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="max-w-xl w-full my-8 bg-[#0e1a16] border border-zen-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-scale-up">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Session Complete
          </div>
          <div className="text-5xl my-2">🧘</div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Excellent Mindful Practice!
          </h2>
          <p className="text-sm text-zen-300">
            You showed up for your body, breath, and inner tranquility.
          </p>
        </div>

        {/* Milestone / Badge Unlock Alert (if achieved) */}
        {unlockedMilestones.length > 0 && (
          <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-zen-600/20 border border-amber-400/50 flex items-center gap-4 animate-bounce-short">
            <div className="text-4xl">{unlockedMilestones[0].badge_emoji || '🏆'}</div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                ✨ New Milestone Unlocked!
              </span>
              <h4 className="text-lg font-bold text-white">
                Day {unlockedMilestones[0].day_number} — {unlockedMilestones[0].title}
              </h4>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 text-center">
          <div className="p-3.5 rounded-2xl bg-zen-900/60 border border-zen-700/40">
            <span className="text-xs text-zen-400 block mb-1">Duration</span>
            <span className="text-xl font-extrabold text-white font-mono">
              {sessionResult?.duration_minutes || 15} min
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zen-900/60 border border-zen-700/40">
            <span className="text-xs text-zen-400 block mb-1">Active Streak</span>
            <span className="text-xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              🔥 {sessionResult?.current_streak || 1} {sessionResult?.current_streak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zen-900/60 border border-zen-700/40">
            <span className="text-xs text-zen-400 block mb-1">Total Days</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              🌱 {sessionResult?.total_practice_days || 1}
            </span>
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="space-y-4 my-6">
          <div>
            <label className="text-xs font-semibold text-zen-300 uppercase tracking-wider block mb-2">
              How do you feel after practice?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setMood(opt.label)}
                  className={`py-2 px-1 rounded-2xl border text-center transition-all ${
                    mood === opt.label
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                      : 'bg-zen-900/40 border-zen-700/50 text-zen-400 hover:text-white'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.emoji}</span>
                  <span className="text-[11px] font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-zen-300 mb-1.5">
              <span>Energy Level</span>
              <span className="text-amber-400 font-bold">{energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-zen-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Yoga Journal Reflection Note */}
          <div>
            <label className="text-xs font-semibold text-zen-300 uppercase tracking-wider block mb-1.5">
              Yoga Journal Note (Optional)
            </label>
            <textarea
              rows="2"
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="What did you feel after today's practice? (e.g. My shoulders released deep tension...)"
              className="w-full px-4 py-2.5 rounded-xl bg-zen-950/70 border border-zen-700/50 text-white text-sm placeholder-zen-600 focus:outline-none focus:border-zen-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => handleSave('progress')}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl bg-zen-800 hover:bg-zen-700 border border-zen-600/40 text-zen-200 text-sm font-semibold transition-all"
          >
            View Progress
          </button>
          <button
            onClick={() => handleSave('journey')}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            Continue Journey ➔
          </button>
        </div>

      </div>
    </div>
  );
}
