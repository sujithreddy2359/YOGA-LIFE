import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, BookOpen, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AIAssistantChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am your **Yoga Life AI Assistant**, grounded in our verified knowledge base of yoga asanas, pranayama breathing, philosophy, and safety cues. How may I support your practice today?',
      sources: [],
      suggested_poses: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'What is Tree Pose?',
    'Recommend a 15-minute beginner routine',
    'How do I relieve lower back tension?',
    'What is the meaning of Pranayama?'
  ];

  const handleSend = async (queryText = input) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({ role: m.role, content: m.content }));
      const res = await api.queryAssistant(text, historyPayload);

      const botMsg = {
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        suggested_poses: res.suggested_poses || [],
        disclaimer: res.disclaimer
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, I encountered an issue retrieving that from the knowledge base. Please try asking about a specific pose like Tree Pose, Warrior, or asking for a beginner routine.',
          sources: [],
          suggested_poses: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] max-w-4xl mx-auto rounded-3xl bg-[#0c1613] border border-zen-700/40 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-zen-900 via-[#13241e] to-zen-900 border-b border-zen-700/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Yoga Life Assistant
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                RAG Grounded
              </span>
            </h3>
            <p className="text-xs text-zen-400">Grounded in verified yoga asanas & wellness knowledge</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-zen-700/80 border border-zen-600 flex items-center justify-center text-amber-300 text-sm flex-shrink-0 mt-1">
                🧘
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-zen-600 text-white shadow-md'
                  : 'bg-zen-900/80 border border-zen-700/50 text-zen-100 shadow-lg'
              }`}
            >
              <div className="whitespace-pre-line">{m.content}</div>

              {/* Suggested Poses Cards (from RAG) */}
              {m.suggested_poses && m.suggested_poses.length > 0 && (
                <div className="mt-4 pt-3 border-t border-zen-700/50">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Referenced Poses in Library:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {m.suggested_poses.map((p) => (
                      <Link
                        key={p.id}
                        to={`/yoga/${p.id}`}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-zen-950/60 border border-zen-700/60 hover:border-amber-400/50 transition-all text-left group"
                      >
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-zen-400">{p.difficulty} • {p.duration_sec}s</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded Sources / Citations */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-zen-800 text-[11px] text-zen-400 flex flex-wrap gap-2">
                  <span className="font-semibold text-zen-300">Sources:</span>
                  {m.sources.map((src, sIdx) => (
                    <span key={sIdx} className="bg-zen-950/60 px-2 py-0.5 rounded border border-zen-800">
                      📖 {src.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Educational Disclaimer */}
              {m.disclaimer && (
                <div className="mt-3 text-[10px] text-zen-500 italic flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-zen-500" />
                  <span>{m.disclaimer}</span>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zen-800 border border-zen-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-zen-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Consulting Yoga Life knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-zen-950/40 border-t border-zen-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-zen-500 text-[11px] font-semibold flex-shrink-0">Try:</span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-zen-900 border border-zen-700/50 hover:border-amber-400/50 text-zen-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-[#0a120f] border-t border-zen-700/40 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about yoga poses, breathing, routines, or philosophy..."
          className="flex-1 px-4 py-3 rounded-2xl bg-zen-950/80 border border-zen-700/50 text-white text-sm placeholder-zen-500 focus:outline-none focus:border-amber-400/80"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white disabled:opacity-40 transition-all shadow-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
