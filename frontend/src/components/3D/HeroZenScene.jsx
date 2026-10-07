import React, { useState } from 'react';

/**
 * HeroZenScene — GIF-based immersive hero visual
 * Replaces the Three.js canvas with the uploaded yoga GIF
 * wrapped in a premium cinematic frame with animated overlays.
 */
export default function HeroZenScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-[520px] md:h-[620px] relative rounded-3xl overflow-hidden border border-zen-600/20 shadow-2xl bg-[#09110e]">

      {/* ── Ambient corner glows ── */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl z-0" />

      {/* ── Skeleton shimmer while GIF loads ── */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-zen-600/30 border-t-emerald-500 animate-spin" />
        </div>
      )}

      {/* ── The yoga GIF ── */}
      <img
        src="/yoga-hero.gif"
        alt="Yoga Life — animated yoga practice"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectPosition: 'center top' }}
      />

      {/* ── Dark gradient vignette overlay for depth ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09110e]/70 via-transparent to-[#09110e]/30 z-10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09110e]/40 via-transparent to-[#09110e]/20 z-10" />

      {/* ── Floating live badge ── */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-zen-950/70 backdrop-blur-md border border-zen-500/30 text-xs text-zen-300 flex items-center gap-2 select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Yoga Life • Live Wellness</span>
      </div>

      {/* ── Bottom ambient text strip ── */}
      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center">
        <div className="px-5 py-2 rounded-full bg-zen-950/60 backdrop-blur-md border border-zen-600/30 text-xs text-zen-300 tracking-widest uppercase select-none">
          🧘&nbsp;&nbsp;Learn · Breathe · Practice · Transform
        </div>
      </div>

      {/* ── Decorative corner accent lines ── */}
      <div className="pointer-events-none absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-xl z-20" />
      <div className="pointer-events-none absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-500/30 rounded-br-xl z-20" />
    </div>
  );
}
