import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Heart, Clock, Sun, Moon } from 'lucide-react';

export default function OnboardingPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('Relaxation');
  const [experience, setExperience] = useState('Beginner');
  const [dailyTime, setDailyTime] = useState(15);
  const [preferredTime, setPreferredTime] = useState('Morning');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goals = [
    { id: 'Relaxation', label: 'Relaxation & Calm', emoji: '🧘', desc: 'Soothe mental anxiety and downregulate stress' },
    { id: 'Focus', label: 'Mental Focus & Clarity', emoji: '🧠', desc: 'Sharpen cognitive awareness and presence' },
    { id: 'Flexibility', label: 'Flexibility & Mobility', emoji: '🤸', desc: 'Unlock tight hips, hamstrings, and thoracic spine' },
    { id: 'Strength', label: 'Strength & Core Power', emoji: '💪', desc: 'Build foundational muscular stamina and stability' },
    { id: 'Better Sleep', label: 'Better Deep Sleep', emoji: '😴', desc: 'Evening restorative poses for peaceful sleep' },
    { id: 'Energy', label: 'Vitality & Energy', emoji: '⚡', desc: 'Dynamic pranayama and awakening flows' },
    { id: 'General Wellness', label: 'General Wellness', emoji: '🌿', desc: 'Balanced holistic mind-body practice' },
  ];

  const experienceLevels = [
    { id: 'Beginner', title: 'Beginner Yogi', desc: 'New to yoga or returning after a break. Step-by-step guidance.' },
    { id: 'Intermediate', title: 'Intermediate Practitioner', desc: 'Familiar with core asanas and looking to deepen breath flow.' },
    { id: 'Advanced', title: 'Advanced Practitioner', desc: 'Deep regular practice, exploring challenging balances & holds.' },
  ];

  const timeOptions = [5, 10, 15, 30, 45, 60];

  const timeOfDayOptions = [
    { id: 'Morning', label: 'Morning Awakening', icon: '🌅', desc: 'Start the day grounded and energized' },
    { id: 'Afternoon', label: 'Afternoon Reset', icon: '☀️', desc: 'Midday mobility to dissolve desk fatigue' },
    { id: 'Evening', label: 'Evening Unwind', icon: '🌙', desc: 'Calm the nervous system before bedtime' },
    { id: 'Custom time', label: 'Flexible / Anytime', icon: '✨', desc: 'Practice whenever inspiration strikes' },
  ];

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await api.submitOnboarding({
        primary_goal: goal,
        experience_level: experience,
        preferred_duration_minutes: dailyTime,
        preferred_time_of_day: preferredTime
      });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding failed:', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full rounded-3xl bg-[#0d1714] border border-zen-700/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-zen-500/10 blur-3xl pointer-events-none" />

        {/* Stepper Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-zen-400 mb-2 uppercase tracking-wider">
            <span>Step {step} of 4</span>
            <span className="text-amber-400">
              {step === 1 && 'Primary Goal'}
              {step === 2 && 'Experience Level'}
              {step === 3 && 'Daily Practice Time'}
              {step === 4 && 'Preferred Routine Time'}
            </span>
          </div>
          <div className="w-full h-2 bg-zen-950 rounded-full overflow-hidden flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-zen-500 to-amber-400' : 'bg-zen-900'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1 — Primary Goal */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Personalized Practice
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                What do you want to focus on?
              </h2>
              <p className="text-xs text-zen-400 mt-1">We tailor your daily flow recommendations based on this goal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    goal === g.id
                      ? 'bg-zen-800/90 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-[1.01]'
                      : 'bg-zen-950/60 border-zen-800 hover:border-zen-700 text-zen-300'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div>
                    <span className={`text-sm font-bold block ${goal === g.id ? 'text-amber-300' : 'text-white'}`}>
                      {g.label}
                    </span>
                    <p className="text-[11px] text-zen-400 leading-tight mt-0.5">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Experience Level */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Skill & Comfort
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                What is your yoga experience?
              </h2>
              <p className="text-xs text-zen-400 mt-1">We adjust pose difficulty and breath pacing accordingly.</p>
            </div>

            <div className="space-y-3">
              {experienceLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExperience(lvl.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    experience === lvl.id
                      ? 'bg-zen-800/90 border-amber-400 text-white shadow-lg'
                      : 'bg-zen-950/60 border-zen-800 hover:border-zen-700 text-zen-300'
                  }`}
                >
                  <div>
                    <h4 className={`text-base font-bold ${experience === lvl.id ? 'text-amber-300' : 'text-white'}`}>
                      {lvl.title}
                    </h4>
                    <p className="text-xs text-zen-400 mt-0.5">{lvl.desc}</p>
                  </div>
                  {experience === lvl.id && <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — Daily Time */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Daily Commitment
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                How much daily time can you commit?
              </h2>
              <p className="text-xs text-zen-400 mt-1">Even 5 mindful minutes a day creates powerful neural shifts.</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDailyTime(t)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    dailyTime === t
                      ? 'bg-zen-800 border-amber-400 text-amber-300 font-bold shadow-lg scale-105'
                      : 'bg-zen-950/60 border-zen-800 text-zen-300 hover:text-white'
                  }`}
                >
                  <span className="text-2xl font-mono block mb-1">{t}</span>
                  <span className="text-[11px] uppercase tracking-wider text-zen-400">Minutes</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — Preferred Time */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Daily Routine
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                When do you prefer to practice?
              </h2>
              <p className="text-xs text-zen-400 mt-1">We can send gentle optional practice reminders at your ideal time.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timeOfDayOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreferredTime(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    preferredTime === opt.id
                      ? 'bg-zen-800/90 border-amber-400 text-white shadow-lg'
                      : 'bg-zen-950/60 border-zen-800 hover:border-zen-700 text-zen-300'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <span className={`text-sm font-bold block ${preferredTime === opt.id ? 'text-amber-300' : 'text-white'}`}>
                      {opt.label}
                    </span>
                    <p className="text-[11px] text-zen-400 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-zen-800/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-3 rounded-xl bg-zen-900 border border-zen-700 text-xs font-semibold text-zen-300 hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 text-white text-sm font-bold tracking-wide shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              {isSubmitting ? 'Saving Profile...' : 'Complete & Open Dashboard ➔'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
