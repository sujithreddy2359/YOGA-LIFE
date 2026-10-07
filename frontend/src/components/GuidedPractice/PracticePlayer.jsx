import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Minimize2, CheckCircle, Wind } from 'lucide-react';
import { yogaAudio } from '../../utils/audio';
import Pose3DViewer from '../3D/Pose3DViewer';

export default function PracticePlayer({
  routineTitle = 'Guided Yoga Practice',
  poses = [],
  onComplete,
  onExit
}) {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSide, setCurrentSide] = useState('left'); // left, right, both
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');

  const containerRef = useRef(null);

  const currentPose = poses[currentPoseIndex] || {
    name: 'Tree Pose',
    sanskrit_name: 'Vrikshasana',
    duration_sec: 30,
    rest_sec: 10,
    side: 'both',
    breathing_cues: 'Inhale to lengthen the spine, exhale to root down.',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    model_3d_type: 'tree_pose'
  };

  const nextPose = poses[currentPoseIndex + 1];
  const targetDuration = isResting ? (currentPose.rest_sec || 10) : (currentPose.duration_sec || 30);

  // Initialize timer on pose change
  useEffect(() => {
    if (isResting) {
      setSecondsRemaining(currentPose.rest_sec || 10);
    } else {
      setSecondsRemaining(currentPose.duration_sec || 30);
    }
  }, [currentPoseIndex, isResting, currentSide]);

  // Breathing pacer cycle (4s in, 4s out)
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000);
    return () => clearInterval(breathInterval);
  }, []);

  // Main countdown timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 4 && prev > 1 && soundEnabled) {
          yogaAudio.playCountdownTick();
        }

        if (prev <= 1) {
          if (soundEnabled) {
            yogaAudio.playSingingBowl();
          }

          // Handle multi-side transitions
          if (!isResting && currentPose.has_sides === 2 && currentSide === 'left') {
            setCurrentSide('right');
            return currentPose.duration_sec || 30;
          }

          // Move to rest or next pose
          if (!isResting && (currentPose.rest_sec || 10) > 0) {
            setIsResting(true);
            return currentPose.rest_sec || 10;
          } else {
            // Move to next pose or complete
            if (currentPoseIndex < poses.length - 1) {
              setCurrentPoseIndex((i) => i + 1);
              setIsResting(false);
              setCurrentSide('left');
              return poses[currentPoseIndex + 1]?.duration_sec || 30;
            } else {
              clearInterval(timer);
              if (onComplete) onComplete();
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isResting, currentPoseIndex, currentSide, soundEnabled, poses]);

  const handleNext = () => {
    if (currentPoseIndex < poses.length - 1) {
      setCurrentPoseIndex((i) => i + 1);
      setIsResting(false);
      setCurrentSide('left');
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex((i) => i - 1);
      setIsResting(false);
      setCurrentSide('left');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const progressPercent = Math.max(0, Math.min(100, ((targetDuration - secondsRemaining) / targetDuration) * 100));
  const totalRoutineProgress = Math.round(((currentPoseIndex + (progressPercent / 100)) / poses.length) * 100);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#080e0c] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden"
    >
      {/* Ambient background aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-zen-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div>
          <span className="text-xs font-semibold text-zen-400 uppercase tracking-widest block">
            {routineTitle}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Pose {currentPoseIndex + 1} of {poses.length}
          </h2>
        </div>

        {/* Global Progress Bar */}
        <div className="hidden sm:flex flex-col items-center w-48">
          <div className="w-full bg-zen-900 rounded-full h-2 overflow-hidden border border-zen-700/50">
            <div
              className="bg-gradient-to-r from-zen-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${totalRoutineProgress}%` }}
            />
          </div>
          <span className="text-[11px] text-zen-400 mt-1">{totalRoutineProgress}% Complete</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-2xl bg-zen-900/80 border border-zen-700/40 text-zen-300 hover:text-white"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-zen-500" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-zen-900/80 border border-zen-700/40 text-zen-300 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20"
          >
            End Practice
          </button>
        </div>
      </div>

      {/* Main Center Display (Large Visible Timer & Visuals for mobile distance) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left: 3D Visualization / Photo */}
        <div className="relative">
          <div className="w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border border-zen-600/30 shadow-2xl relative bg-[#0d1714]">
            {currentPose.image_url ? (
              <img
                src={currentPose.image_url}
                alt={currentPose.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Pose3DViewer poseModel={currentPose.model_3d_type || 'tree_pose'} poseName={currentPose.name} />
            )}

            {/* Side Indicator Overlay */}
            {currentPose.has_sides === 2 && (
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-zen-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {currentSide === 'left' ? 'Left Side' : 'Right Side'}
              </div>
            )}

            {isResting && (
              <div className="absolute inset-0 bg-zen-950/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <Wind className="w-12 h-12 text-teal-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-serif font-bold text-teal-200">Rest & Breathe</h3>
                <p className="text-sm text-zen-300 mt-1">Prepare for next posture</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Giant Timer, Sanskrit Name & Breathing Cues */}
        <div className="flex flex-col items-center text-center space-y-5">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
              {isResting ? 'Rest Period' : currentPose.name}
            </h1>
            {currentPose.sanskrit_name && !isResting && (
              <p className="text-lg text-amber-400/90 font-medium italic mt-1 font-serif">
                {currentPose.sanskrit_name}
              </p>
            )}
          </div>

          {/* Large Circular Countdown Timer (Visible across the room) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-zen-900"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-1000 ease-linear ${
                  isResting ? 'stroke-teal-400' : 'stroke-amber-400'
                }`}
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono text-white">
                {String(Math.floor(secondsRemaining / 60)).padStart(2, '0')}:
                {String(secondsRemaining % 60).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase tracking-widest text-zen-400 mt-1">
                {isResting ? 'Resting' : 'Holding Pose'}
              </span>
            </div>
          </div>

          {/* Breathing Pacer Bar */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zen-900/60 border border-zen-700/40 text-xs text-zen-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Breath Rhythm: <strong className="text-white">{breathPhase}</strong></span>
          </div>

          {/* Pose Breathing cue */}
          <p className="text-xs sm:text-sm text-zen-300/90 max-w-md px-4 py-2.5 rounded-xl bg-zen-950/40 border border-zen-800">
            💡 {currentPose.breathing_cues || 'Maintain steady diaphragmatic breath.'}
          </p>
        </div>

      </div>

      {/* Bottom Interactive Controls */}
      <div className="relative z-10 max-w-2xl mx-auto w-full flex items-center justify-between gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPoseIndex === 0}
          className="p-4 rounded-2xl bg-zen-900/80 border border-zen-700/50 hover:bg-zen-800 text-zen-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex-1 py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl transition-all transform hover:scale-[1.02] ${
            isPaused
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-r from-zen-600 to-zen-500 hover:from-zen-500 text-white shadow-zen-600/30'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-6 h-6 fill-current" /> RESUME SESSION
            </>
          ) : (
            <>
              <Pause className="w-6 h-6 fill-current" /> PAUSE PRACTICE
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-4 rounded-2xl bg-zen-900/80 border border-zen-700/50 hover:bg-zen-800 text-zen-200 transition-all"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
