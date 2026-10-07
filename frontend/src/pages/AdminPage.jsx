import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Layers, BookOpen, Plus, Trash2, Edit2, Clock, CheckCircle2, Eye, X, Mail, Phone, Calendar, Award, Flame, Target } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [poses, setPoses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // New pose form state
  const [newPoseName, setNewPoseName] = useState('');
  const [newSanskrit, setNewSanskrit] = useState('');
  const [newCategory, setNewCategory] = useState('Standing');
  const [newDifficulty, setNewDifficulty] = useState('Beginner');
  const [newDuration, setNewDuration] = useState(30);
  const [newDescription, setNewDescription] = useState('');
  const [newBreathing, setNewBreathing] = useState('');
  const [newBodyTarget, setNewBodyTarget] = useState('Full Body');
  const [newImageUrl, setNewImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [m, u, p] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminUsers(),
        api.getPoses({ limit: 50 })
      ]);
      setMetrics(m);
      setUsersList(u);
      setPoses(p);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePose = async (e) => {
    e.preventDefault();
    if (!newPoseName || !newDescription) return;

    setIsSubmitting(true);
    try {
      const slug = newPoseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await api.createPose({
        name: newPoseName,
        sanskrit_name: newSanskrit || null,
        slug,
        category: newCategory,
        difficulty: newDifficulty,
        recommended_duration_sec: parseInt(newDuration) || 30,
        has_sides: 1,
        body_target: newBodyTarget,
        tags: [newCategory, newDifficulty, newBodyTarget],
        description: newDescription,
        instructions: [
          'Begin in a steady, upright foundational stance.',
          'Align joints mindfully and breathe diaphragmatically.',
          'Hold steady without tension, then release smoothly.'
        ],
        benefits: [
          'Enhances postural alignment and mindfulness',
          'Strengthens muscle engagement and flexibility'
        ],
        precautions: [
          'Listen to your body alignment without forcing extreme range'
        ],
        breathing_cues: newBreathing || 'Maintain steady, quiet nasal breathing.',
        image_url: newImageUrl || `/kaggle_poses/${slug}.jpg`,
        model_3d_type: 'tree_pose'
      });

      setSuccessMsg(`Pose "${newPoseName}" added to library!`);
      setTimeout(() => setSuccessMsg(''), 3000);

      setNewPoseName('');
      setNewSanskrit('');
      setNewDescription('');
      setNewBreathing('');
      loadAdminData();
    } catch (err) {
      console.error('Failed to add pose:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePose = async (poseId) => {
    if (!window.confirm('Are you sure you want to delete this pose?')) return;
    try {
      await api.deletePose(poseId);
      setPoses((prev) => prev.filter((p) => p.id !== poseId));
    } catch (err) {
      console.error('Failed to delete pose:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-zen-400">Please sign in with administrator credentials.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Platform Administrator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Admin Operations Console
        </h1>
        <p className="text-xs sm:text-sm text-zen-300 mt-1">
          Manage system users, inspect user details, edit pose library, and monitor system metrics.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card rounded-3xl p-5 border-zen-700/50">
            <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Total Users</span>
            <span className="text-3xl font-serif font-bold text-white font-mono">{metrics.total_users}</span>
          </div>
          <div className="glass-card rounded-3xl p-5 border-zen-700/50">
            <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Total Sessions</span>
            <span className="text-3xl font-serif font-bold text-emerald-400 font-mono">{metrics.total_practice_sessions}</span>
          </div>
          <div className="glass-card rounded-3xl p-5 border-zen-700/50">
            <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Active Poses</span>
            <span className="text-3xl font-serif font-bold text-amber-400 font-mono">{metrics.total_poses_in_library}</span>
          </div>
          <div className="glass-card rounded-3xl p-5 border-zen-700/50">
            <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Awareness Articles</span>
            <span className="text-3xl font-serif font-bold text-teal-400 font-mono">{metrics.total_awareness_articles}</span>
          </div>
          <div className="glass-card rounded-3xl p-5 border-zen-700/50">
            <span className="text-[11px] text-zen-400 uppercase tracking-wider block mb-1">Practice Hours</span>
            <span className="text-3xl font-serif font-bold text-amber-300 font-mono">{metrics.total_practice_hours_logged} hrs</span>
          </div>
        </div>
      )}

      {/* Registered System Users & Details Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> System Users Inspection ({usersList.length})
            </h3>
            <p className="text-xs text-zen-400 mt-0.5">Click any user card or "View Details" button to view full user profile & statistics.</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
          {usersList.length === 0 ? (
            <p className="text-xs text-zen-400 py-4 text-center">No registered users found.</p>
          ) : (
            usersList.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-zen-950/80 hover:bg-zen-900/60 border border-zen-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center font-bold text-white uppercase text-sm flex-shrink-0">
                    {u.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm">{u.full_name || 'Anonymous User'}</strong>
                      {u.is_admin ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                          👑 Administrator
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-zen-800 border border-zen-700 text-zen-300 text-[10px] font-medium">
                          🧘 Yogi Member
                        </span>
                      )}
                    </div>
                    <span className="text-zen-400 block mt-0.5">{u.email} • {u.phone_number || 'No Phone'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-zen-400 text-[11px] font-mono hidden md:inline">
                    Joined: {new Date(u.created_at).toLocaleDateString()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${u.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedUser(u)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add New Yoga Pose Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-6">
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" /> Add New Yoga Pose
        </h3>

        <form onSubmit={handleCreatePose} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1">Pose Name (English)</label>
              <input
                type="text"
                required
                value={newPoseName}
                onChange={(e) => setNewPoseName(e.target.value)}
                placeholder="e.g. Lotus Pose"
                className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1">Sanskrit Name</label>
              <input
                type="text"
                value={newSanskrit}
                onChange={(e) => setNewSanskrit(e.target.value)}
                placeholder="e.g. Padmasana"
                className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Standing">Standing</option>
                <option value="Sitting">Sitting</option>
                <option value="Balancing">Balancing</option>
                <option value="Backbend">Backbend</option>
                <option value="Twisting">Twisting</option>
                <option value="Restorative">Restorative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1">Body Focus Target</label>
              <input
                type="text"
                value={newBodyTarget}
                onChange={(e) => setNewBodyTarget(e.target.value)}
                placeholder="e.g. Core, Spine, Legs"
                className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1">Duration (Seconds)</label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zen-300 block mb-1">Description</label>
            <textarea
              rows="2"
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description of the posture..."
              className="w-full px-4 py-2.5 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              {isSubmitting ? 'Saving Pose...' : 'Add Pose to Library'}
            </button>
          </div>
        </form>
      </div>

      {/* Library Poses Management Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-4">
        <h3 className="text-xl font-serif font-bold text-white">Existing Poses Library ({poses.length})</h3>

        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {poses.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-zen-950/60 border border-zen-800 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-10 h-10 rounded-xl object-cover border border-zen-700 flex-shrink-0"
                />
                <div>
                  <strong className="text-white block text-sm">{p.name}</strong>
                  <span className="text-zen-400">{p.sanskrit_name || p.slug} • {p.category} • {p.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-zen-900 border border-zen-800 text-zen-400 font-mono">
                  ⏱️ {p.recommended_duration_sec}s
                </span>
                <button
                  type="button"
                  onClick={() => handleDeletePose(p.id)}
                  className="p-2 rounded-lg text-zen-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          USER DETAILS INSPECTION MODAL
      ════════════════════════════════════════════════════════ */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-3xl bg-[#0d1714] border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zen-900 hover:bg-zen-800 text-zen-400 hover:text-white border border-zen-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* User Header */}
            <div className="flex items-center gap-4 border-b border-zen-800/80 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center text-2xl font-bold text-white uppercase shadow-lg shadow-amber-500/20 flex-shrink-0">
                {selectedUser.full_name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-serif font-bold text-white">{selectedUser.full_name || 'Anonymous User'}</h2>
                  {selectedUser.is_admin ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                      👑 Master Administrator
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-zen-800 border border-zen-700 text-zen-300 text-xs font-medium">
                      🧘 Yogi Member
                    </span>
                  )}
                </div>
                <p className="text-xs text-zen-400">User Account ID: #{selectedUser.id}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-zen-950/80 border border-zen-800 space-y-1">
                <span className="text-zen-400 font-medium block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address
                </span>
                <p className="text-white font-semibold text-sm">{selectedUser.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-950/80 border border-zen-800 space-y-1">
                <span className="text-zen-400 font-medium block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number
                </span>
                <p className="text-white font-semibold text-sm">{selectedUser.phone_number || 'Not Provided'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-950/80 border border-zen-800 space-y-1">
                <span className="text-zen-400 font-medium block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> Account Created Date
                </span>
                <p className="text-white font-mono text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-950/80 border border-zen-800 space-y-1">
                <span className="text-zen-400 font-medium block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-rose-400" /> Primary Wellness Goal
                </span>
                <p className="text-white font-semibold text-sm">{selectedUser.profile?.primary_goal || 'General Wellness'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-950/80 border border-zen-800 space-y-1">
                <span className="text-zen-400 font-medium block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Experience Level
                </span>
                <p className="text-white font-semibold text-sm">{selectedUser.profile?.experience_level || 'Beginner'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-950/80 border border-zen-800 space-y-1">
                <span className="text-zen-400 font-medium block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-sky-400" /> Daily Target Practice
                </span>
                <p className="text-white font-semibold text-sm">
                  {selectedUser.profile?.preferred_duration_minutes || 30} mins • {selectedUser.profile?.preferred_time_of_day || 'Morning'}
                </p>
              </div>

            </div>

            {/* Practice Statistics */}
            <div className="p-4 rounded-2xl bg-zen-950/90 border border-amber-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-zen-400 block text-[11px] uppercase tracking-wider">Sessions Completed</span>
                <span className="text-2xl font-serif font-bold text-amber-300 font-mono">
                  {selectedUser.profile?.total_sessions_completed || 0}
                </span>
              </div>
              <div className="text-right">
                <span className="text-zen-400 block text-[11px] uppercase tracking-wider">Total Practice Time</span>
                <span className="text-2xl font-serif font-bold text-emerald-400 font-mono">
                  {Math.round((selectedUser.profile?.total_practice_seconds || 0) / 60)} <span className="text-xs text-zen-400 font-sans">mins</span>
                </span>
              </div>
            </div>

            {selectedUser.profile?.bio && (
              <div className="p-4 rounded-2xl bg-zen-950/60 border border-zen-800 space-y-1">
                <span className="text-[11px] text-zen-400 font-semibold uppercase tracking-wider block">Bio / Notes</span>
                <p className="text-zen-200 text-xs italic">{selectedUser.profile.bio}</p>
              </div>
            )}

            {/* Footer Close Action */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 rounded-xl bg-zen-800 hover:bg-zen-700 text-white font-semibold text-xs transition-colors"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
