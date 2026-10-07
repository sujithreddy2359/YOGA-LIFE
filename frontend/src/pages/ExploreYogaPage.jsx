import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, Play, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExploreYogaPage() {
  const { isAuthenticated } = useAuth();
  const [poses, setPoses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedBodyTarget, setSelectedBodyTarget] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [posesData, catData] = await Promise.all([
          api.getPoses(),
          api.getCategories(),
        ]);
        setPoses(posesData);
        setCategories(catData);

        if (isAuthenticated) {
          const favs = await api.getFavorites();
          setFavorites(new Set(favs.map((f) => f.item_id)));
        }
      } catch (err) {
        console.error('Failed to fetch poses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated]);

  const handleToggleFavorite = async (e, pose) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    const isFav = favorites.has(pose.id);
    try {
      if (isFav) {
        await api.removeFavorite('pose', pose.id);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(pose.id);
          return next;
        });
      } else {
        await api.addFavorite({
          item_type: 'pose',
          item_id: pose.id,
          title: pose.name,
          subtitle: pose.sanskrit_name,
          image_url: pose.image_url,
        });
        setFavorites((prev) => new Set(prev).add(pose.id));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const filteredPoses = poses.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sanskrit_name && p.sanskrit_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesBody = selectedBodyTarget === 'All' || (p.body_target && p.body_target.toLowerCase().includes(selectedBodyTarget.toLowerCase()));

    return matchesSearch && matchesCategory && matchesDifficulty && matchesBody;
  });

  const categoryOptions = ['All', 'Standing', 'Sitting', 'Balancing', 'Backbend', 'Twisting', 'Restorative'];
  const difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const bodyTargetOptions = ['All', 'Full Body', 'Shoulders', 'Back', 'Core', 'Legs', 'Balance', 'Mobility', 'Relaxation'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Yoga Asana Sanctuary</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Explore Yoga Poses
        </h1>
        <p className="text-sm text-zen-300 max-w-2xl font-light">
          Browse our curated library of postures, complete with Sanskrit roots, biomechanical benefits, breathing cues, and safety guidance.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-6 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-zen-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pose name, Sanskrit name (e.g. Vrikshasana), or benefit..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zen-950/80 border border-zen-700/60 text-white text-sm placeholder-zen-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="space-y-3 pt-2">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-zen-500 font-semibold text-[11px] uppercase tracking-wider flex-shrink-0">
              Category:
            </span>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-zen-700 border-amber-400 text-amber-300 font-bold shadow-sm'
                    : 'bg-zen-950/60 border-zen-800 text-zen-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty & Body Target Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zen-800/80">
            {/* Difficulty */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zen-500 font-semibold text-[11px] uppercase tracking-wider">
                Difficulty:
              </span>
              {difficultyOptions.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-zen-800 border-emerald-400 text-emerald-300 font-semibold'
                      : 'bg-zen-950 border-zen-800/80 text-zen-400 hover:text-zen-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Body Focus */}
            <div className="flex items-center gap-2 text-xs overflow-x-auto max-w-md">
              <span className="text-zen-500 font-semibold text-[11px] uppercase tracking-wider flex-shrink-0">
                Body Focus:
              </span>
              {bodyTargetOptions.map((tgt) => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => setSelectedBodyTarget(tgt)}
                  className={`px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap transition-all ${
                    selectedBodyTarget === tgt
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-zen-950 border-zen-800/80 text-zen-400 hover:text-zen-200'
                  }`}
                >
                  {tgt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Poses Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zen-400">Loading yoga library...</p>
        </div>
      ) : filteredPoses.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-zen-950/40 border border-zen-800 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-serif font-bold text-white">No Matching Poses Found</h3>
          <p className="text-xs text-zen-400">Try adjusting your search query or relaxing your filter selection.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedDifficulty('All'); setSelectedBodyTarget('All'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-zen-800 text-xs font-semibold text-amber-300 hover:bg-zen-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPoses.map((pose) => {
            const isFav = favorites.has(pose.id);
            return (
              <Link
                key={pose.id}
                to={`/yoga/${pose.id}`}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Pose Thumbnail */}
                <div className="w-full h-48 bg-zen-950 relative overflow-hidden">
                  <img
                    src={pose.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'}
                    alt={pose.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1a16] via-transparent to-transparent opacity-80" />

                  {/* Difficulty pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zen-950/80 backdrop-blur-md border border-zen-700/60 text-[11px] font-bold text-emerald-300">
                    {pose.difficulty}
                  </div>

                  {/* Favorite button */}
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, pose)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isFav
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-zen-950/70 border-zen-700/60 text-zen-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        {pose.category}
                      </span>
                      <span className="text-[11px] text-zen-400">⏱️ {pose.recommended_duration_sec}s</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {pose.name}
                    </h3>
                    {pose.sanskrit_name && (
                      <p className="text-xs text-zen-400 font-serif italic mb-2">
                        {pose.sanskrit_name}
                      </p>
                    )}

                    <p className="text-xs text-zen-300/80 line-clamp-2 leading-relaxed">
                      {pose.description}
                    </p>
                  </div>

                  {/* Body target tag & CTA */}
                  <div className="pt-3 border-t border-zen-800/80 flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-zen-950 border border-zen-800 text-[10px] text-zen-400">
                      🎯 {pose.body_target}
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
