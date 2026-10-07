import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Flame, Trophy, Award, Sparkles, CheckCircle2, Lock, Play, ArrowRight, ShieldCheck } from 'lucide-react';
import JourneyTimeline from '../components/Journey/JourneyTimeline';

export default function JourneyPage() {
  const navigate = useNavigate();
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getJourneyProgress().then(setJourneyData).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const flexibilityFlowPoses = [
    {
      name: 'Triangle Pose',
      sanskrit_name: 'Trikonasana',
      duration_sec: 45,
      rest_sec: 10,
      has_sides: 2,
      breathing_cues: 'Inhale to elongate the spine, exhale to expand thoracic rotation.',
      image_url: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80&pose=triangle-pose',
      model_3d_type: 'triangle_pose'
    },
    {
      name: 'Seated Forward Bend',
      sanskrit_name: 'Paschimottanasana',
      duration_sec: 60,
      rest_sec: 10,
      has_sides: 1,
      breathing_cues: 'Inhale to lengthen the front torso, exhale to hinge deeply from hip creases.',
      image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80&pose=seated-forward-bend',
      model_3d_type: 'forward_bend'
    },
    {
      name: 'Cobra Pose',
      sanskrit_name: 'Bhujangasana',
      duration_sec: 30,
      rest_sec: 10,
      has_sides: 1,
      breathing_cues: 'Inhale to elevate the chest with spinal strength.',
      image_url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80&pose=cobra-pose',
      model_3d_type: 'cobra_pose'
    }
  ];

  const handleStartFlexibilityFlow = () => {
    navigate('/practice', {
      state: {
        routineTitle: 'Day 14 Flexibility Journey Flow',
        poses: flexibilityFlowPoses,
        yogaType: 'Flexibility'
      }
    });
  };

  const isDay14Unlocked = (journeyData?.current_practice_days || 0) >= 14;
  const isDay30Unlocked = (journeyData?.current_practice_days || 0) >= 30;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>30-Day Mindful Progression</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Your 30-Day Yoga Journey
        </h1>
        <p className="text-sm text-zen-300 max-w-2xl font-light">
          Consistency is the sacred soil where mental peace and physical freedom blossom. Each milestone unlocks based purely on your completed practice days.
        </p>
      </div>

      {/* Main Interactive Timeline */}
      <JourneyTimeline journeyData={journeyData} />

      {/* Special Unlocked Journey Routines */}
      <div className="space-y-6 pt-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Exclusive Unlocked Sequences
          </span>
          <h2 className="text-2xl font-serif font-bold text-white">
            Milestone Routine Tracks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Day 14 Flexibility Track */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDay14Unlocked
              ? 'bg-gradient-to-br from-zen-900 via-[#13261f] to-zen-950 border-emerald-500/50 shadow-2xl'
              : 'bg-zen-950/60 border-zen-800/80 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🤸</span>
              {isDay14Unlocked ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400 text-xs font-bold">
                  ✓ Unlocked (Day 14)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-900 text-zen-400 border border-zen-800 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" /> Unlocks on Day 14
                </span>
              )}
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Flexibility & Fascial Mobility Flow
            </h3>
            <p className="text-xs text-zen-300 leading-relaxed mb-6 font-light">
              Deep progressive hamstring, hip rotator, and thoracic mobility sequence unlocked after two weeks of steady practice.
            </p>

            <button
              onClick={handleStartFlexibilityFlow}
              disabled={!isDay14Unlocked}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                isDay14Unlocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-zen-900 border border-zen-800 text-zen-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" /> {isDay14Unlocked ? 'START FLEXIBILITY FLOW' : 'LOCKED MILESTONE'}
            </button>
          </div>

          {/* Day 30 Yoga Life Champion Masterclass */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDay30Unlocked
              ? 'bg-gradient-to-br from-zen-900 via-amber-950/40 to-zen-950 border-amber-400/60 shadow-2xl'
              : 'bg-zen-950/60 border-zen-800/80 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🏆</span>
              {isDay30Unlocked ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 text-xs font-bold">
                  🏆 Champion Masterclass Unlocked
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-900 text-zen-400 border border-zen-800 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" /> Unlocks on Day 30
                </span>
              )}
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Yoga Life Champion Flow
            </h3>
            <p className="text-xs text-zen-300 leading-relaxed mb-6 font-light">
              The pinnacle integration flow bringing together advanced breathwork, deep hip openers, balance poses, and restorative surrender.
            </p>

            <button
              onClick={handleStartFlexibilityFlow}
              disabled={!isDay30Unlocked}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                isDay30Unlocked
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-zen-900 border border-zen-800 text-zen-500 cursor-not-allowed'
              }`}
            >
              <Trophy className="w-4 h-4" /> {isDay30Unlocked ? 'START CHAMPION FLOW' : 'LOCKED MILESTONE'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
