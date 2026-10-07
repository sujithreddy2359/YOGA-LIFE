import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Flame, Sparkles, Trophy, Play, Clock, ArrowRight, 
  Calendar, CheckCircle2, Heart, Award, ShieldCheck, Activity, PlusCircle 
} from 'lucide-react';
import JourneyTimeline from '../components/Journey/JourneyTimeline';
import InteractiveBodyMap from '../components/BodyMap/InteractiveBodyMap';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [sumRes, jRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getJourneyProgress(),
        ]);
        setSummary(sumRes);
        setJourneyData(jRes);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleStartRecommended = () => {
    if (!summary?.recommended_routine?.poses) return;
    navigate('/practice', {
      state: {
        routineTitle: summary.recommended_routine.title,
        poses: summary.recommended_routine.poses,
        yogaType: summary.recommended_routine.category,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-sm text-zen-300">Loading your mindful dashboard...</p>
      </div>
    );
  }

  const rec = summary?.recommended_routine;
  const todayStats = summary?.today_stats || { total_minutes: 0, sessions_count: 0, poses_count: 0 };
  const weeklyGoalMin = summary?.weekly_goal_minutes || 150;
  const currentWeeklyMin = summary?.current_weekly_minutes || 0;
  const weeklyProgressPct = Math.min(100, Math.round((currentWeeklyMin / weeklyGoalMin) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Greeting & Main Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zen-900/90 via-[#13251e] to-zen-900/90 border border-zen-600/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Personal Wellness Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            {summary?.greeting || 'Good Morning'}, {user?.full_name || 'Yogi'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zen-300 mt-1">
            Ready to ground your body and expand your breath today?
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/custom-flow"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zen-800 hover:bg-zen-700 border border-zen-600/50 text-xs font-semibold text-zen-200 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Custom Flow
          </Link>
          <Link
            to="/journey"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            <Flame className="w-4 h-4" /> 30-Day Journey
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics Cards: Today's Practice, Streak, Journey Progress, Weekly Goal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Today's Practice */}
        <div className="glass-card rounded-3xl p-6 border-zen-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zen-400 uppercase tracking-wider">Today's Practice</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">⏱️</span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-white font-mono">
              {todayStats.total_minutes} <span className="text-sm font-sans font-normal text-zen-400">min</span>
            </div>
            <p className="text-xs text-zen-400 mt-1">
              {todayStats.sessions_count} {todayStats.sessions_count === 1 ? 'Session' : 'Sessions'} • {todayStats.poses_count} Poses
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zen-800/80 text-[11px] text-zen-400 flex items-center justify-between">
            <span>Status:</span>
            <span className={todayStats.sessions_count > 0 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-medium'}>
              {todayStats.sessions_count > 0 ? '✓ Completed Today' : 'Scheduled Today'}
            </span>
          </div>
        </div>

        {/* 2. Active Streak */}
        <div className="glass-card rounded-3xl p-6 border-zen-700/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-semibold text-zen-400 uppercase tracking-wider">Current Streak</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 text-lg">🔥</span>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-serif font-bold text-amber-400 flex items-center gap-1.5">
              🔥 {summary?.current_streak || 0} <span className="text-sm font-sans font-normal text-zen-300">Days</span>
            </div>
            <p className="text-xs text-zen-400 mt-1">
              Longest record: {summary?.longest_streak || 0} days in a row
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zen-800/80 text-[11px] text-zen-400 relative z-10">
            {summary?.current_streak > 0
              ? 'Keep your rhythm going today!'
              : 'Complete a practice to start your streak!'}
          </div>
        </div>

        {/* 3. Current Journey Day */}
        <div className="glass-card rounded-3xl p-6 border-zen-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zen-400 uppercase tracking-wider">Yoga Journey</span>
            <span className="p-2 rounded-xl bg-zen-800 text-amber-300 text-lg">🌱</span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-white font-mono">
              Day {summary?.current_journey_day || 0} <span className="text-sm text-zen-400">/ {summary?.next_milestone_day || 7}</span>
            </div>
            <div className="w-full h-1.5 bg-zen-950 rounded-full overflow-hidden mt-2">
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${journeyData?.progress_percentage || 10}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-zen-800/80 text-[11px] text-amber-300">
            {summary?.days_to_next_milestone > 0
              ? `${summary.days_to_next_milestone} more practice days to next unlock`
              : 'Milestone Unlocked!'}
          </div>
        </div>

        {/* 4. Weekly Goal Progress */}
        <div className="glass-card rounded-3xl p-6 border-zen-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zen-400 uppercase tracking-wider">Weekly Goal</span>
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 text-lg">🎯</span>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-white font-mono">
              {currentWeeklyMin} <span className="text-sm font-sans text-zen-400">/ {weeklyGoalMin} min</span>
            </div>
            <div className="w-full h-1.5 bg-zen-950 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all"
                style={{ width: `${weeklyProgressPct}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-zen-800/80 text-[11px] text-zen-400 flex items-center justify-between">
            <span>{weeklyProgressPct}% Completed</span>
            <Link to="/history" className="text-amber-400 hover:underline">Analytics ➔</Link>
          </div>
        </div>

      </div>

      {/* Recommended Practice Banner & Recent Login Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recommended Practice Card */}
        {rec && (
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12231c] via-[#0e1c16] to-[#0c1613] border border-zen-600/50 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Recommended Today
                </span>
                <span className="text-xs text-amber-300/90 font-medium italic">
                  {rec.reason}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {rec.title}
                </h2>
                <p className="text-sm text-zen-300 mt-1 font-light leading-relaxed">
                  {rec.subtitle}
                </p>
              </div>

              {/* Routine metadata badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="px-3 py-1 rounded-xl bg-zen-900 border border-zen-700 text-xs text-zen-200">
                  ⏱️ {rec.duration_minutes} Minutes
                </span>
                <span className="px-3 py-1 rounded-xl bg-zen-900 border border-zen-700 text-xs text-zen-200">
                  🌱 {rec.difficulty}
                </span>
                <span className="px-3 py-1 rounded-xl bg-zen-900 border border-zen-700 text-xs text-zen-200">
                  🧘 {rec.poses_count} Curated Poses
                </span>
              </div>

              {/* Pose list pill previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {rec.poses.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zen-950/70 border border-zen-800 text-xs text-zen-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-zen-800 flex items-center justify-center text-[10px] font-bold text-amber-400">
                      {idx + 1}
                    </span>
                    <span className="truncate font-medium text-white">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-zen-800/80 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleStartRecommended}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-zen-600 via-zen-500 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-zen-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" /> START PRACTICE NOW
              </button>
              <Link
                to="/custom-flow"
                className="text-xs text-zen-400 hover:text-white"
              >
                Or customize this routine
              </Link>
            </div>
          </div>
        )}

        {/* Recent Session Activity & Quick Access */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Recent Activity
            </h3>
            
            <div className="space-y-3">
              {summary?.recent_activity && summary.recent_activity.length > 0 ? (
                summary.recent_activity.map((act, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-zen-950/60 border border-zen-800/80 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white block">{act.day}</strong>
                      <span className="text-zen-400">{act.text}</span>
                    </div>
                    <span className="text-[10px] text-zen-500 font-mono">{act.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-zen-400">
                  Welcome to Yoga Life! Complete your first session to build activity.
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                to="/history"
                className="block text-center py-2.5 rounded-xl bg-zen-800/60 hover:bg-zen-800 border border-zen-700/50 text-xs font-semibold text-zen-200 transition-colors"
              >
                View Complete History ➔
              </Link>
            </div>
          </div>

          {/* Quick Journal Prompt Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-zen-900/60 to-[#102019] border border-zen-700/50 shadow-xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">My Yoga Journal</h4>
              <p className="text-xs text-zen-400 mt-0.5">Reflect on your inner sensations</p>
            </div>
            <Link
              to="/journal"
              className="p-3 rounded-2xl bg-zen-800 hover:bg-zen-700 text-amber-400 border border-zen-600/40 transition-all"
            >
              📝
            </Link>
          </div>
        </div>

      </div>

      {/* 30-Day Yoga Journey Progress Timeline Section */}
      <JourneyTimeline journeyData={journeyData} />

    </div>
  );
}
