import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, Trash2, Play, Sparkles, Clock, Save, Layers, ArrowRight } from 'lucide-react';

export default function CustomFlowBuilderPage() {
  const navigate = useNavigate();

  const [allPoses, setAllPoses] = useState([]);
  const [flowTitle, setFlowTitle] = useState('My Morning Flow');
  const [selectedPoses, setSelectedPoses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRoutines, setSavedRoutines] = useState([]);

  useEffect(() => {
    api.getPoses().then((poses) => {
      setAllPoses(poses);
      // Preload with 4 canonical poses as a starting baseline
      if (poses.length >= 4) {
        setSelectedPoses([
          { ...poses[0], duration_sec: 30, rest_sec: 10 },
          { ...poses[1], duration_sec: 45, rest_sec: 10 },
          { ...poses[2], duration_sec: 45, rest_sec: 10 },
          { ...poses[3], duration_sec: 60, rest_sec: 10 },
        ]);
      }
    });

    api.getCustomRoutines().then(setSavedRoutines).catch(console.error);
  }, []);

  const handleAddPose = (pose) => {
    setSelectedPoses((prev) => [
      ...prev,
      { ...pose, duration_sec: pose.recommended_duration_sec || 30, rest_sec: 10 },
    ]);
  };

  const handleRemovePose = (idx) => {
    setSelectedPoses((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateDuration = (idx, duration) => {
    setSelectedPoses((prev) => {
      const next = [...prev];
      next[idx].duration_sec = Math.max(5, parseInt(duration) || 30);
      return next;
    });
  };

  const totalDurationSec = selectedPoses.reduce(
    (acc, p) => acc + (p.duration_sec || 30) + (p.rest_sec || 10),
    0
  );
  const totalMinutes = Math.floor(totalDurationSec / 60);
  const totalRemainingSec = totalDurationSec % 60;

  const handleStartSession = () => {
    if (selectedPoses.length === 0) return;
    navigate('/practice', {
      state: {
        routineTitle: flowTitle || 'Custom Yoga Flow',
        poses: selectedPoses,
        yogaType: 'Custom Flow',
      },
    });
  };

  const handleSaveRoutine = async () => {
    if (!flowTitle || selectedPoses.length === 0) return;
    setIsSaving(true);
    try {
      const payload = {
        title: flowTitle,
        category: 'Custom',
        difficulty: 'All Levels',
        poses: selectedPoses.map((p) => ({
          pose_id: p.id,
          name: p.name,
          sanskrit_name: p.sanskrit_name,
          duration_sec: p.duration_sec,
          rest_sec: p.rest_sec,
          image_url: p.image_url,
          breathing_cues: p.breathing_cues,
        })),
      };
      await api.createCustomRoutine(payload);
      const updated = await api.getCustomRoutines();
      setSavedRoutines(updated);
      alert('Custom routine saved successfully!');
    } catch (err) {
      console.error('Failed to save routine:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Routine Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Custom Practice Builder
        </h1>
        <p className="text-sm text-zen-300 mt-1">
          Select poses, configure personalized hold and rest intervals, and launch your tailored session immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Sequence Editor */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-6">
            
            {/* Title & Duration Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zen-800">
              <div className="flex-1">
                <label className="text-xs font-semibold text-zen-400 uppercase tracking-wider block mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  value={flowTitle}
                  onChange={(e) => setFlowTitle(e.target.value)}
                  placeholder="e.g. My Morning Flow"
                  className="w-full text-xl font-serif font-bold text-white bg-transparent border-b border-zen-700 focus:outline-none focus:border-amber-400 pb-1"
                />
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs font-semibold text-zen-400 uppercase tracking-wider block">
                  Total Duration
                </span>
                <span className="text-2xl font-serif font-bold text-amber-400 font-mono">
                  {totalMinutes}:{String(totalRemainingSec).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Sequence Item List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {selectedPoses.length === 0 ? (
                <div className="text-center py-12 text-xs text-zen-400">
                  Your flow is empty. Click "+ Add to Flow" from the pose library on the right to construct your routine.
                </div>
              ) : (
                selectedPoses.map((pose, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zen-950/70 border border-zen-800/80 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-zen-800 flex items-center justify-center text-xs font-bold text-amber-400">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{pose.name}</h4>
                        {pose.sanskrit_name && (
                          <span className="text-xs text-zen-400 font-serif italic block">
                            {pose.sanskrit_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-zen-900 px-3 py-1.5 rounded-xl border border-zen-700 text-xs text-zen-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <input
                          type="number"
                          min="5"
                          step="5"
                          value={pose.duration_sec}
                          onChange={(e) => handleUpdateDuration(idx, e.target.value)}
                          className="w-12 bg-transparent text-white font-mono text-center focus:outline-none"
                        />
                        <span>sec</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePose(idx)}
                        className="p-2 rounded-xl text-zen-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zen-800 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSaveRoutine}
                disabled={isSaving || selectedPoses.length === 0}
                className="py-3 px-5 rounded-2xl bg-zen-800 hover:bg-zen-700 border border-zen-600/50 text-zen-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Routine
              </button>

              <button
                type="button"
                onClick={handleStartSession}
                disabled={selectedPoses.length === 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-zen-600 via-zen-500 to-amber-500 hover:from-zen-500 text-white text-sm font-bold shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> START SESSION NOW ➔
              </button>
            </div>

          </div>
        </div>

        {/* Right Col: Pose Selection Library */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Pose Library</span>
              <span className="text-xs text-zen-400">{allPoses.length} available</span>
            </h3>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {allPoses.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-zen-950/60 border border-zen-800 flex items-center justify-between gap-3 hover:border-zen-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <span className="text-[10px] text-zen-400 block">{p.category} • {p.difficulty}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddPose(p)}
                    className="p-2 rounded-xl bg-zen-800 hover:bg-zen-700 text-amber-400 border border-zen-600/40 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
