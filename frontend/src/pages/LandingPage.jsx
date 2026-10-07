import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, ArrowRight, Play, CheckCircle2, ShieldCheck, Heart, Compass, BookOpen, Star, Wind } from 'lucide-react';
import HeroZenScene from '../components/3D/HeroZenScene';
import InteractiveBodyMap from '../components/BodyMap/InteractiveBodyMap';
import AIAssistantChat from '../components/Assistant/AIAssistantChat';
import { api } from '../services/api';

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [todayAwareness, setTodayAwareness] = useState(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
    api.getTodayAwareness().then(setTodayAwareness).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen space-y-24">
      
      {/* Hero Section with Interactive 3D Canvas */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Typography */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zen-800/80 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Learn • Breathe • Practice • Transform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Your Journey to a <br />
              <span className="zen-gradient-text">Healthier Mind & Body</span>
            </h1>

            <p className="text-base sm:text-lg text-zen-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover yoga, understand your practice, and build a healthier daily routine through guided movement, awareness and mindful practice.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-zen-600 via-zen-500 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-zen-600/30 transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
              >
                START YOUR JOURNEY <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/yoga"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zen-900/80 hover:bg-zen-800 border border-zen-700/60 text-zen-200 font-semibold text-sm transition-all text-center"
              >
                EXPLORE YOGA
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zen-800/60 text-center lg:text-left">
              <div>
                <span className="text-2xl font-bold font-serif text-white">40+</span>
                <span className="block text-xs text-zen-400">Curated Poses</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-serif text-amber-400">30-Day</span>
                <span className="block text-xs text-zen-400">Yoga Journey</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-serif text-emerald-400">100%</span>
                <span className="block text-xs text-zen-400">Mindful Rhythm</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Scene */}
          <div className="lg:col-span-6">
            <HeroZenScene />
          </div>

        </div>
      </section>

      {/* Core Product Loop Idea Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zen-950 via-[#101e18] to-zen-950 border border-zen-700/40 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              The Mindful Transformation Cycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              The Yoga Life Experience
            </h2>
          </div>

          {/* Loop Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {[
              { step: '1', title: 'LEARN', desc: 'Origins & Philosophy', icon: '📖' },
              { step: '2', title: 'UNDERSTAND', desc: 'Anatomy & Cues', icon: '🧠' },
              { step: '3', title: 'CHOOSE', desc: 'Goal-Based Flows', icon: '🎯' },
              { step: '4', title: 'PRACTICE', desc: 'Guided Timers', icon: '🧘' },
              { step: '5', title: 'RECORD', desc: 'Mood & Activity', icon: '📝' },
              { step: '6', title: 'TRACK', desc: 'Streak & Stats', icon: '🔥' },
              { step: '7', title: 'IMPROVE', desc: 'Mobility Gains', icon: '📈' },
              { step: '8', title: 'JOURNEY', desc: '30-Day Badges', icon: '🏆' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-zen-900/50 border border-zen-800 flex flex-col items-center justify-between"
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-extrabold text-amber-300 tracking-wider">
                  {item.title}
                </span>
                <span className="text-[10px] text-zen-400 mt-0.5">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Yoga Section (3D / Animated Wellness Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Diverse Traditions & Methods
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Types of Yoga
            </h2>
          </div>
          <Link
            to="/awareness"
            className="text-sm font-semibold text-zen-300 hover:text-amber-400 flex items-center gap-1 mt-3 sm:mt-0"
          >
            Read Yoga Philosophy & Guide ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative"
            >
              {cat.image_url && (
                <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 relative">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1a16] via-transparent to-transparent" />
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {cat.difficulty || 'All Levels'}
                </span>
                <h3 className="text-xl font-serif font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-xs text-zen-300 line-clamp-3 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zen-700/40 flex items-center justify-between text-xs text-zen-400">
                <span>⏱️ {cat.typical_duration}</span>
                <Link
                  to="/yoga"
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Explore Poses
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Yoga Awareness Card ("Did You Know?") */}
      {todayAwareness && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-zen-900 via-[#13241d] to-[#0c1613] border border-zen-600/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> Today's Yoga Awareness
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {todayAwareness.article.title}
              </h2>
              <p className="text-sm text-zen-300 leading-relaxed max-w-2xl font-light">
                {todayAwareness.article.summary}
              </p>

              <div className="p-4 rounded-2xl bg-zen-950/70 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <strong className="block text-amber-300 font-bold mb-0.5">Did You Know?</strong>
                  <span>{todayAwareness.did_you_know}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/awareness"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zen-700 hover:bg-zen-600 text-white text-xs font-bold tracking-wide transition-all"
                >
                  LEARN MORE & READ ARTICLE ➔
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              {todayAwareness.article.image_url && (
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-zen-700/50">
                  <img
                    src={todayAwareness.article.image_url}
                    alt="Awareness"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* Interactive Body / Goal Map Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveBodyMap onSelectRegion={(region) => console.log('Selected:', region)} />
      </section>

      {/* 30-Day Yoga Journey Feature Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0d1714] border border-zen-700/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Core Progressive Feature
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              The 30-Day Yoga Journey
            </h2>
            <p className="text-sm sm:text-base text-zen-300 leading-relaxed font-light">
              Milestones are unlocked purely by your real practice activity—never by passing calendar days alone. Build your habit from Day 1 Beginner to Day 30 Champion.
            </p>

            <ul className="space-y-3 text-sm text-zen-200">
              <li className="flex items-center gap-3">
                <span className="text-xl">🌱</span>
                <span><strong>Day 1 — Beginner:</strong> Take your first step onto the mat</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <span><strong>Day 7 — Consistency:</strong> Solidify a 7-day steady practice habit</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">🤸</span>
                <span><strong>Day 14 — Flexibility Journey:</strong> Unlock specialized mobility flows</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <span><strong>Day 30 — Yoga Life Champion:</strong> Transform your mind and body</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all"
              >
                Join the 30-Day Journey ➔
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <AIAssistantChat />
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-zen-900 via-zen-800 to-amber-950/40 border border-zen-600/40 shadow-2xl space-y-6">
          <span className="text-4xl">🧘</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Ready to Begin Your Transformation?
          </h2>
          <p className="text-sm sm:text-base text-zen-300 max-w-lg mx-auto font-light">
            Start your daily yoga journey with personalized guidance, mindful timers, and rewarding milestones.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all"
            >
              CREATE YOUR FREE ACCOUNT ➔
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
