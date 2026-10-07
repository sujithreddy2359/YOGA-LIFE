import React, { useState } from 'react';

/**
 * Pose3DViewer — GIF/image-based pose viewer.
 * Replaces the Three.js canvas with the yoga GIF as a visual backdrop
 * and adds premium pose-info overlay badges for an immersive feel.
 */
export default function Pose3DViewer({ poseModel = 'tree_pose', poseName = 'Yoga Pose', poseImage = null }) {
  const [loaded, setLoaded] = useState(false);

  // Determine what image/gif to show: use pose-specific image if provided, else fall back to the hero GIF
  const displaySrc = poseImage || '/yoga-hero.gif';

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-zen-700/40 bg-[#0c1613]">

      {/* ── Corner accent ── */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl z-0" />

      {/* ── Loading skeleton ── */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-zen-600/30 border-t-emerald-500 animate-spin" />
        </div>
      )}

      {/* ── Pose image/GIF ── */}
      <img
        src={displaySrc}
        alt={poseName}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectPosition: 'center top' }}
      />

      {/* ── Gradient vignette ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c1613]/80 via-transparent to-[#0c1613]/20 z-10" />

      {/* ── Top label ── */}
      <div className="absolute top-3 left-3 z-20 text-xs px-2.5 py-1 rounded-full bg-zen-950/70 backdrop-blur-md border border-zen-600/30 text-zen-300 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Pose View • {poseName}
      </div>

      {/* ── Bottom pose name strip ── */}
      <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center">
        <span className="px-4 py-1.5 rounded-full bg-zen-950/70 backdrop-blur-md border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
          🧘 {poseName}
        </span>
      </div>

      {/* ── Decorative corner brackets ── */}
      <div className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg z-20" />
      <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg z-20" />
    </div>
  );
}
