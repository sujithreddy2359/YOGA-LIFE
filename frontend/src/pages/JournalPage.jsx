import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookOpen, Sparkles, Send, Heart, Smile, Calendar, PlusCircle } from 'lucide-react';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [newText, setNewText] = useState('');
  const [mood, setMood] = useState('Relaxed');
  const [energy, setEnergy] = useState(8);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getJournalEntries().then(setEntries).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const moodEmojis = {
    Great: '😊',
    Good: '🙂',
    Relaxed: '😌',
    Okay: '😐',
    Tired: '😴',
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createJournalEntry({
        reflection_text: newText,
        mood,
        energy_level: energy,
        practice_duration_minutes: 15,
        tags: [mood]
      });
      setEntries([created, ...entries]);
      setNewText('');
    } catch (err) {
      console.error('Failed to create journal entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Mindful Reflections</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          My Yoga Journal
        </h1>
        <p className="text-xs sm:text-sm text-zen-300 mt-1">
          Record inner shifts, somatic sensations, and mental stillness observed during and after practice.
        </p>
      </div>

      {/* New Entry Form */}
      <form onSubmit={handleCreateEntry} className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-2xl space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Write Today's Reflection
        </h3>

        <textarea
          rows="3"
          required
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="What did you feel during or after your practice today? (e.g. My breath slowed and I felt a sense of grounding stillness...)"
          className="w-full p-4 rounded-2xl bg-zen-950/80 border border-zen-700/60 text-white text-sm placeholder-zen-500 focus:outline-none focus:border-amber-400 resize-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
          {/* Mood */}
          <div>
            <label className="text-xs font-semibold text-zen-300 block mb-1.5">Mood Feeling</label>
            <div className="flex gap-2">
              {['Great', 'Good', 'Relaxed', 'Okay', 'Tired'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs transition-all ${
                    mood === m ? 'bg-amber-500/20 border-amber-400 text-white font-bold' : 'bg-zen-950 border-zen-800 text-zen-400'
                  }`}
                >
                  <span className="block text-base">{moodEmojis[m]}</span>
                  <span className="text-[10px]">{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <div className="flex justify-between items-center text-xs text-zen-300 mb-1.5 font-semibold">
              <span>Energy Level</span>
              <span className="text-amber-400 font-bold">{energy} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-zen-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !newText.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Save Reflection
          </button>
        </div>
      </form>

      {/* Previous Entries Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-white">Previous Journal Entries</h3>
        
        {isLoading ? (
          <div className="text-center py-10 text-xs text-zen-400">Loading journal...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zen-950/40 border border-zen-800 text-center text-xs text-zen-400">
            No journal entries recorded yet. Write your first reflection above!
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 sm:p-6 rounded-3xl bg-zen-950/70 border border-zen-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{moodEmojis[entry.mood] || '😌'}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">{entry.mood || 'Relaxed'}</span>
                      <span className="text-[10px] text-zen-400 font-mono">
                        {new Date(entry.entry_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-zen-900 border border-zen-800 text-xs text-amber-400 font-mono">
                    ⚡ Energy: {entry.energy_level || 8}/10
                  </span>
                </div>

                <p className="text-sm text-zen-200 font-light leading-relaxed pl-1">
                  "{entry.reflection_text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
