import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Calendar, Clock, Award, Flame, CheckCircle2, TrendingUp, Sparkles, Filter } from 'lucide-react';

export default function AnalyticsHistoryPage() {
  const [graphData, setGraphData] = useState(null);
  const [weeklyInsights, setWeeklyInsights] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [timeframe, setTimeframe] = useState('week'); // week, month
  const [historyFilter, setHistoryFilter] = useState('all'); // all, today, week, month
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [gRes, wRes, hRes] = await Promise.all([
          api.getPracticeGraph(timeframe),
          api.getWeeklyInsights(),
          api.getPracticeHistory(historyFilter === 'all' ? null : historyFilter)
        ]);
        setGraphData(gRes);
        setWeeklyInsights(wRes);
        setHistoryLogs(hRes);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, [timeframe, historyFilter]);

  const chartData = graphData?.chart_data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Practice Analytics & History</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Yoga Practice Insights
        </h1>
        <p className="text-xs sm:text-sm text-zen-300 font-light">
          Monitor your daily minutes on the mat, track habit consistency, and celebrate your growth.
        </p>
      </div>

      {/* Top 4 Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border-zen-700/50">
          <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Total Practice</span>
          <span className="text-3xl font-serif font-bold text-white font-mono">{graphData?.total_hours || 0} hrs</span>
          <span className="text-[10px] text-zen-500 block mt-1">Across all sessions</span>
        </div>

        <div className="glass-card rounded-3xl p-5 border-zen-700/50">
          <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Avg Session</span>
          <span className="text-3xl font-serif font-bold text-amber-400 font-mono">{graphData?.average_session_minutes || 0} min</span>
          <span className="text-[10px] text-zen-500 block mt-1">Per practice session</span>
        </div>

        <div className="glass-card rounded-3xl p-5 border-zen-700/50">
          <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Total Sessions</span>
          <span className="text-3xl font-serif font-bold text-emerald-400 font-mono">{graphData?.total_sessions || 0}</span>
          <span className="text-[10px] text-zen-500 block mt-1">Completed flows</span>
        </div>

        <div className="glass-card rounded-3xl p-5 border-zen-700/50">
          <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Practice Days</span>
          <span className="text-3xl font-serif font-bold text-teal-400 font-mono">{graphData?.total_practice_days || 0}</span>
          <span className="text-[10px] text-zen-500 block mt-1">Unique calendar days</span>
        </div>
      </div>

      {/* Main Practice Minutes Graph */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Daily Practice Minutes</h3>
            <p className="text-xs text-zen-400">Total mindful practice minutes logged each day</p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-zen-950 border border-zen-800 text-xs font-semibold">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeframe === 'week' ? 'bg-zen-800 text-amber-400 shadow' : 'text-zen-400 hover:text-white'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeframe === 'month' ? 'bg-zen-800 text-amber-400 shadow' : 'text-zen-400 hover:text-white'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="display_label"
                stroke="#679882"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#679882"
                fontSize={11}
                tickLine={false}
                unit="m"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1613',
                  borderColor: '#4f7b68',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val} Minutes`, 'Duration']}
              />
              <Bar
                dataKey="minutes"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Insights Box */}
      {weeklyInsights && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zen-900 via-[#12231c] to-zen-900 border border-zen-600/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Your Week in Yoga
          </div>
          <p className="text-base text-zen-200 font-light leading-relaxed">
            {weeklyInsights.encouraging_feedback}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-zen-800/80 text-xs">
            <div>
              <span className="text-zen-400 block">Weekly Total</span>
              <strong className="text-white text-base font-mono">{weeklyInsights.total_minutes} min</strong>
            </div>
            <div>
              <span className="text-zen-400 block">Days Practiced</span>
              <strong className="text-white text-base font-mono">{weeklyInsights.days_practiced} days</strong>
            </div>
            <div>
              <span className="text-zen-400 block">Longest Session</span>
              <strong className="text-white text-base font-mono">{weeklyInsights.longest_session_minutes} min</strong>
            </div>
            <div>
              <span className="text-zen-400 block">Active Streak</span>
              <strong className="text-amber-400 text-base font-mono">🔥 {weeklyInsights.current_streak} days</strong>
            </div>
          </div>
        </div>
      )}

      {/* Practice History Session Logs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xl font-serif font-bold text-white">Practice History Logs</h3>
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'today', 'week'].map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-3 py-1 rounded-lg border text-xs capitalize transition-all ${
                  historyFilter === f
                    ? 'bg-zen-800 border-amber-400 text-amber-300 font-semibold'
                    : 'bg-zen-950 border-zen-800 text-zen-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Time' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {historyLogs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-zen-950/40 border border-zen-800 text-center text-xs text-zen-400">
              No practice history logged yet. Complete your first session today!
            </div>
          ) : (
            historyLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-2xl bg-zen-950/60 border border-zen-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-zen-900 border border-zen-700 flex items-center justify-center text-lg">
                    🧘
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{log.routine_name || 'Mindful Practice'}</h4>
                    <span className="text-xs text-zen-400">
                      {new Date(log.practice_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {log.yoga_type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zen-300">
                  <span className="px-2.5 py-1 rounded-lg bg-zen-900 border border-zen-800">
                    ⏱️ {log.duration_minutes} min
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zen-900 border border-zen-800">
                    🧘 {log.poses_count} poses
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ✓ Completed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
