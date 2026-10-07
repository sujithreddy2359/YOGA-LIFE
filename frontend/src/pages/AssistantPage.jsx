import React from 'react';
import AIAssistantChat from '../components/Assistant/AIAssistantChat';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Bot className="w-3.5 h-3.5 text-amber-400" />
          <span>RAG-Grounded Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          AI Yoga Assistant
        </h1>
        <p className="text-xs sm:text-sm text-zen-300 mt-1">
          Ask questions about yoga poses, step-by-step alignments, breathing cues, and tailored routine recommendations grounded directly in our verified yoga knowledge base.
        </p>
      </div>

      <AIAssistantChat />
    </div>
  );
}
