import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InteractiveBodyMap({ onSelectRegion }) {
  const [selectedRegion, setSelectedRegion] = useState('Full Body');

  const regions = [
    { id: 'Full Body', label: 'Full Body', desc: 'Holistic alignment and overall vitality', icon: '✨' },
    { id: 'Shoulders', label: 'Shoulders & Neck', desc: 'Release chest & upper back tension', icon: '🦅' },
    { id: 'Back', label: 'Spine & Lumbar', desc: 'Decompress spinal discs and strengthen extensors', icon: '🌿' },
    { id: 'Core', label: 'Core & Center', desc: 'Activate abdominal fire & pelvic stability', icon: '⚡' },
    { id: 'Legs', label: 'Legs & Hamstrings', desc: 'Lengthen posterior chain & ground stance', icon: '🌲' },
    { id: 'Balance', label: 'Balance & Focus', desc: 'Single-pointed concentration & proprioception', icon: '⚖️' },
    { id: 'Mobility', label: 'Hips & Mobility', desc: 'Deep joint opening and connective tissue release', icon: '🤸' },
    { id: 'Relaxation', label: 'Nervous System & Calm', desc: 'Downregulate stress & restore parasympathetic rhythm', icon: '🌙' },
  ];

  const handleSelect = (regionId) => {
    setSelectedRegion(regionId);
    if (onSelectRegion) onSelectRegion(regionId);
  };

  return (
    <div className="p-6 rounded-3xl bg-zen-950/70 border border-zen-700/40 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            Targeted Anatomical Focus
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            What area do you want to focus on?
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zen-400 bg-zen-900/80 px-3 py-1.5 rounded-full border border-zen-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Careful, non-medical wellness guidance</span>
        </div>
      </div>

      {/* Grid of Interactive Body & Goal Focus Targets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {regions.map((r) => {
          const isSelected = selectedRegion === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleSelect(r.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-zen-800 to-zen-900 border-amber-400/80 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'bg-zen-900/40 border-zen-800/60 hover:bg-zen-800/50 hover:border-zen-700 text-zen-300'
              }`}
            >
              <div>
                <span className="text-2xl block mb-2">{r.icon}</span>
                <span className={`text-sm font-bold block ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                  {r.label}
                </span>
                <p className="text-[11px] text-zen-400 leading-snug mt-1">
                  {r.desc}
                </p>
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold text-emerald-400 mt-3 flex items-center gap-1">
                  Active Focus <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
