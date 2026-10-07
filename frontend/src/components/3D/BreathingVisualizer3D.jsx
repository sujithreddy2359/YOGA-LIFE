import React, { useState, useEffect } from 'react';

export default function BreathingVisualizer3D({
  pattern = '4-4-4-4', // Inhale - Hold - Exhale - Hold
  isActive = true,
  onPhaseChange
}) {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Rest
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly through the nose' },
      { name: 'Hold', duration: 4, instruction: 'Gently suspend breath with soft chest' },
      { name: 'Exhale', duration: 4, instruction: 'Release smoothly through the nose' },
      { name: 'Rest', duration: 4, instruction: 'Settle in natural stillness' },
    ];

    let currentIdx = 0;
    let timer = phases[currentIdx].duration;
    setPhase(phases[currentIdx].name);
    setSecondsLeft(timer);

    const interval = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        currentIdx = (currentIdx + 1) % phases.length;
        setPhase(phases[currentIdx].name);
        timer = phases[currentIdx].duration;
        if (onPhaseChange) onPhaseChange(phases[currentIdx].name);
      }
      setSecondsLeft(timer);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, pattern]);

  const getPhaseStyles = () => {
    switch (phase) {
      case 'Inhale':
        return {
          scale: 'scale-125',
          bg: 'bg-emerald-500/20 border-emerald-400',
          text: 'text-emerald-300',
          glow: 'shadow-[0_0_50px_rgba(52,211,153,0.35)]',
        };
      case 'Hold':
        return {
          scale: 'scale-125',
          bg: 'bg-amber-500/20 border-amber-400',
          text: 'text-amber-300',
          glow: 'shadow-[0_0_50px_rgba(245,158,11,0.35)]',
        };
      case 'Exhale':
        return {
          scale: 'scale-90',
          bg: 'bg-teal-500/20 border-teal-400',
          text: 'text-teal-300',
          glow: 'shadow-[0_0_30px_rgba(20,184,166,0.25)]',
        };
      default:
        return {
          scale: 'scale-90',
          bg: 'bg-zen-600/20 border-zen-500',
          text: 'text-zen-300',
          glow: 'shadow-none',
        };
    }
  };

  const style = getPhaseStyles();

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center w-52 h-52">
        {/* Outer Pulsing Aura Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ease-in-out ${style.bg} ${style.scale} ${style.glow}`}
        />
        {/* Secondary Geometric Ring */}
        <div
          className={`absolute w-40 h-40 rounded-full border border-dashed border-zen-400/40 transition-all duration-1000 ease-in-out ${style.scale}`}
        />
        {/* Inner Core */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold tracking-wider uppercase transition-colors duration-500 ${style.text}`}>
            {phase}
          </span>
          <span className="text-3xl font-extrabold text-white mt-1">{secondsLeft}s</span>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-zen-300 tracking-wide">
        Pranayama Pace • {phase === 'Inhale' ? 'Breathe In' : phase === 'Hold' ? 'Hold Breath' : phase === 'Exhale' ? 'Breathe Out' : 'Rest'}
      </p>
    </div>
  );
}
