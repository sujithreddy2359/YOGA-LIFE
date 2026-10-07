import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle2, Clock, Sparkles, ChevronRight, ShieldCheck, Sun, Flame, Wind, Moon } from 'lucide-react';

export default function AwarenessPage() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAwareness = async () => {
      try {
        const [arts, cats, today] = await Promise.all([
          api.getAwarenessArticles(),
          api.getCategories(),
          api.getTodayAwareness()
        ]);
        setArticles(arts);
        setCategories(cats);
        setTodayData(today);
        if (arts.length > 0) setSelectedArticle(arts[0]);
      } catch (err) {
        console.error('Failed to load awareness content:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAwareness();
  }, []);

  const handleMarkCompleted = async (articleId) => {
    if (!isAuthenticated) return;
    try {
      await api.completeArticle(articleId);
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, is_completed: true } : a))
      );
      if (selectedArticle?.id === articleId) {
        setSelectedArticle((prev) => ({ ...prev, is_completed: true }));
      }
    } catch (err) {
      console.error('Failed to mark article completed:', err);
    }
  };

  const eightLimbs = [
    { num: '1', name: 'Yama', meaning: 'Universal Morality', desc: 'Non-violence (Ahimsa), truthfulness, non-stealing, and moderation.' },
    { num: '2', name: 'Niyama', meaning: 'Personal Observances', desc: 'Purity, contentment (Santosha), self-discipline, and self-study.' },
    { num: '3', name: 'Asana', meaning: 'Physical Postures', desc: 'Cultivating a steady, comfortable seat for breath and meditation.' },
    { num: '4', name: 'Pranayama', meaning: 'Breath Control', desc: 'Regulation of subtle life-force energy through conscious breathing.' },
    { num: '5', name: 'Pratyahara', meaning: 'Sensory Withdrawal', desc: 'Turning perception inward away from external distractions.' },
    { num: '6', name: 'Dharana', meaning: 'Focused Concentration', desc: 'Binding conscious attention to a single focal point or mantra.' },
    { num: '7', name: 'Dhyana', meaning: 'Meditative Contemplation', desc: 'Unbroken, serene flow of pure meditative awareness.' },
    { num: '8', name: 'Samadhi', meaning: 'Unified Bliss', desc: 'Transcendence of separation; deep unity with all life.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Yoga Awareness & Wisdom Sanctuary</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          What is Yoga?
        </h1>
        <p className="text-sm sm:text-base text-zen-300 max-w-3xl font-light leading-relaxed">
          Yoga is far more than physical exercise. Originating in ancient India over 5,000 years ago from the root <em>'Yuj'</em> (to unite), yoga is a complete scientific art of integrating body, breath, and conscious mind.
        </p>
      </div>

      {/* Today's Daily Awareness Banner */}
      {todayData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zen-900 via-[#14261f] to-zen-900 border border-amber-400/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              ✨ Today's Daily Wisdom
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {todayData.article.title}
            </h3>
            <p className="text-xs sm:text-sm text-zen-300 max-w-xl font-light">
              "{todayData.did_you_know}"
            </p>
          </div>

          <button
            onClick={() => setSelectedArticle(todayData.article)}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap"
          >
            Read Daily Article ➔
          </button>
        </div>
      )}

      {/* The 8 Limbs of Classical Yoga Section */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Classical Ashtanga Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            The Eight Limbs of Patanjali's Yoga
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {eightLimbs.map((limb) => (
            <div
              key={limb.num}
              className="glass-card rounded-3xl p-5 border-zen-700/50 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-2xl bg-zen-800 border border-zen-700 text-amber-400 font-bold flex items-center justify-center text-xs font-mono">
                  0{limb.num}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {limb.meaning}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">{limb.name}</h3>
                <p className="text-xs text-zen-300 font-light leading-relaxed mt-1">{limb.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Articles Reader Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        
        {/* Article Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Awareness Articles
          </h3>
          {articles.map((art) => (
            <button
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedArticle?.id === art.id
                  ? 'bg-zen-800 border-amber-400 text-white shadow-lg'
                  : 'bg-zen-950/60 border-zen-800 text-zen-300 hover:border-zen-700'
              }`}
            >
              <div className="pr-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  {art.category} • {art.reading_time_minutes} min read
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{art.title}</h4>
              </div>
              {art.is_completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zen-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Article Full View */}
        {selectedArticle && (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-zen-400">⏱️ {selectedArticle.reading_time_minutes} min read</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {selectedArticle.title}
              </h2>
            </div>

            {selectedArticle.image_url && (
              <div className="rounded-2xl overflow-hidden h-48 w-full border border-zen-700">
                <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Markdown / Formatted Content */}
            <div className="text-sm text-zen-200 leading-relaxed space-y-4 font-light whitespace-pre-line border-t border-zen-800 pt-4">
              {selectedArticle.content}
            </div>

            {/* Did you know callout */}
            <div className="p-4 rounded-2xl bg-zen-950 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <strong className="block text-amber-300 font-bold mb-0.5">Did You Know?</strong>
                <span>{selectedArticle.did_you_know}</span>
              </div>
            </div>

            {/* Mark as Learned Button */}
            <div className="pt-4 border-t border-zen-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleMarkCompleted(selectedArticle.id)}
                disabled={selectedArticle.is_completed}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  selectedArticle.is_completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white shadow-lg'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedArticle.is_completed ? 'Marked as Learned ✓' : 'Mark as Learned'}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
