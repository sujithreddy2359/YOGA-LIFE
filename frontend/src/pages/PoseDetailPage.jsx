import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Play, Heart, ArrowLeft, ShieldAlert, Wind, Sparkles, CheckCircle2, AlertTriangle, Clock, Layers 
} from 'lucide-react';
import Pose3DViewer from '../components/3D/Pose3DViewer';

export default function PoseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [pose, setPose] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('instructions'); // instructions, benefits, safety, 3d
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPose = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPoseById(id);
        setPose(data);

        if (isAuthenticated) {
          const favs = await api.getFavorites();
          setIsFavorite(favs.some((f) => f.item_id === data.id));
        }
      } catch (err) {
        console.error('Failed to load pose:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPose();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !pose) return;
    try {
      if (isFavorite) {
        await api.removeFavorite('pose', pose.id);
        setIsFavorite(false);
      } else {
        await api.addFavorite({
          item_type: 'pose',
          item_id: pose.id,
          title: pose.name,
          subtitle: pose.sanskrit_name,
          image_url: pose.image_url
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleStartPracticeNow = () => {
    if (!pose) return;
    const singleRoutine = [
      {
        pose_id: pose.id,
        name: pose.name,
        sanskrit_name: pose.sanskrit_name,
        duration_sec: pose.recommended_duration_sec || 30,
        rest_sec: 10,
        side: pose.has_sides === 2 ? 'left' : 'both',
        has_sides: pose.has_sides || 1,
        breathing_cues: pose.breathing_cues,
        image_url: pose.image_url,
        model_3d_type: pose.model_3d_type || 'tree_pose'
      }
    ];

    navigate('/practice', {
      state: {
        routineTitle: `${pose.name} Practice Session`,
        poses: singleRoutine,
        yogaType: pose.category
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!pose) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Pose Not Found</h2>
        <p className="text-sm text-zen-400">The requested yoga posture could not be retrieved from the library.</p>
        <Link to="/yoga" className="inline-block px-5 py-2.5 rounded-xl bg-zen-800 text-amber-400 text-xs font-semibold">
          Back to Explore Yoga
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Back Nav & Quick Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/yoga"
          className="flex items-center gap-2 text-xs font-semibold text-zen-300 hover:text-white bg-zen-900/60 px-3.5 py-2 rounded-xl border border-zen-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Yoga Library
        </Link>

        {isAuthenticated && (
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-zen-900 border-zen-700 text-zen-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-400' : ''}`} />
            {isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
          </button>
        )}
      </div>

      {/* Main Pose Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: High-Res Image / 3D Canvas Switcher */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-zen-600/40 shadow-2xl relative bg-[#09110e]">
            {activeTab === '3d' ? (
              <Pose3DViewer poseModel={pose.model_3d_type || 'tree_pose'} poseName={pose.name} />
            ) : (
              <img
                src={pose.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'}
                alt={pose.name}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zen-950/80 backdrop-blur-md border border-zen-700 text-xs font-bold text-emerald-300">
              {pose.difficulty}
            </div>
          </div>

          {/* 3D vs Photo Toggle Button */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                activeTab !== '3d' ? 'bg-zen-800 border-amber-400 text-amber-300' : 'bg-zen-950/60 border-zen-800 text-zen-400'
              }`}
            >
              📷 Photo Guide
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                activeTab === '3d' ? 'bg-zen-800 border-amber-400 text-amber-300' : 'bg-zen-950/60 border-zen-800 text-zen-400'
              }`}
            >
              🧘 3D Alignment Space
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-zen-950/60 border border-zen-800">
              <span className="text-[10px] text-zen-400 uppercase tracking-wider block">Duration</span>
              <span className="text-base font-bold text-white font-mono">{pose.recommended_duration_sec}s</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zen-950/60 border border-zen-800">
              <span className="text-[10px] text-zen-400 uppercase tracking-wider block">Category</span>
              <span className="text-xs font-bold text-amber-400 truncate block">{pose.category}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zen-950/60 border border-zen-800">
              <span className="text-[10px] text-zen-400 uppercase tracking-wider block">Target</span>
              <span className="text-xs font-bold text-emerald-400 truncate block">{pose.body_target}</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Metadata & Start Practice CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                {pose.category}
              </span>
              <span className="text-xs text-zen-400">• {pose.difficulty}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {pose.name}
            </h1>
            {pose.sanskrit_name && (
              <p className="text-lg text-amber-400/90 font-serif italic mt-0.5">
                {pose.sanskrit_name}
              </p>
            )}
            <p className="text-sm text-zen-300 mt-3 leading-relaxed font-light">
              {pose.description}
            </p>
          </div>

          {/* Breathing Guidance Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-zen-900 via-[#14261f] to-zen-900 border border-zen-600/40 text-xs text-zen-200 flex items-start gap-3">
            <Wind className="w-5 h-5 text-teal-300 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-teal-300 font-bold mb-0.5">Breathing Guidance:</strong>
              <span>{pose.breathing_cues}</span>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> How to Perform Step-by-Step
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-zen-300">
              {pose.instructions?.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-zen-950/60 border border-zen-800/80">
                  <span className="w-6 h-6 rounded-full bg-zen-800 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> General Health Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zen-300">
              {pose.benefits?.map((b, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-zen-950/40 border border-zen-800/60 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Precautions Box */}
          {pose.precautions && pose.precautions.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Safety & Modifications
              </h4>
              <ul className="text-xs text-amber-200/80 space-y-1 pl-1">
                {pose.precautions.map((p, idx) => (
                  <li key={idx}>• {p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-zen-800">
            <button
              onClick={handleStartPracticeNow}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-zen-600 via-zen-500 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-zen-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" /> START GUIDED PRACTICE ({pose.recommended_duration_sec}s)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
