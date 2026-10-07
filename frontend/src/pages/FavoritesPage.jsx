import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getFavorites().then(setFavorites).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (itemType, itemId) => {
    try {
      await api.removeFavorite(itemType, itemId);
      setFavorites((prev) => prev.filter((f) => !(f.item_type === itemType && f.item_id === itemId)));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
          <span>Saved Practices</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          My Favorites
        </h1>
        <p className="text-xs sm:text-sm text-zen-300 mt-1">
          Your bookmarked yoga postures, custom flows, and awareness articles.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xs text-zen-400">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="p-12 rounded-3xl bg-zen-950/40 border border-zen-800 text-center space-y-3">
          <span className="text-4xl">🤍</span>
          <h3 className="text-lg font-serif font-bold text-white">No Favorites Saved Yet</h3>
          <p className="text-xs text-zen-400">Click the heart icon on any yoga pose to save it to your personal sanctuary.</p>
          <Link to="/yoga" className="inline-block px-5 py-2.5 rounded-xl bg-zen-800 text-amber-300 text-xs font-semibold">
            Explore Poses Now ➔
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              {fav.image_url && (
                <div className="h-44 w-full bg-zen-950 overflow-hidden relative">
                  <img src={fav.image_url} alt={fav.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1a16] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    {fav.item_type}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white">{fav.title}</h3>
                  {fav.subtitle && <p className="text-xs text-zen-400 italic">{fav.subtitle}</p>}
                </div>

                <div className="pt-3 border-t border-zen-800 flex items-center justify-between">
                  <button
                    onClick={() => handleRemove(fav.item_type, fav.item_id)}
                    className="p-2 rounded-xl text-zen-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/yoga/${fav.item_id}`}
                    className="px-4 py-2 rounded-xl bg-zen-800 hover:bg-zen-700 text-amber-400 text-xs font-semibold flex items-center gap-1"
                  >
                    View Pose <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
