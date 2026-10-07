import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, Compass, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zen-800/80 bg-[#09110e] text-zen-300 pt-16 pb-24 lg:pb-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧘</span>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">YOGA LIFE</span>
            </div>
            <p className="text-sm text-zen-400 leading-relaxed">
              Immersive 3D Yoga Awareness, Guided Practice, and 30-Day Transformation Journey.
            </p>
            <p className="text-xs text-zen-500 italic">
              "Yoga is the journey of the self, through the self, to the self." — The Bhagavad Gita
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Practice & Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/yoga" className="hover:text-amber-400 transition-colors">Explore Poses</Link></li>
              <li><Link to="/custom-flow" className="hover:text-amber-400 transition-colors">Custom Flow Builder</Link></li>
              <li><Link to="/journey" className="hover:text-amber-400 transition-colors">30-Day Yoga Journey</Link></li>
              <li><Link to="/awareness" className="hover:text-amber-400 transition-colors">Daily Yoga Awareness</Link></li>
            </ul>
          </div>

          {/* Philosophy & Awareness */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Awareness & Mind</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/awareness" className="hover:text-amber-400 transition-colors">Eight Limbs of Yoga</Link></li>
              <li><Link to="/awareness" className="hover:text-amber-400 transition-colors">Pranayama Science</Link></li>
              <li><Link to="/assistant" className="hover:text-amber-400 transition-colors">AI Yoga Assistant</Link></li>
              <li><Link to="/journal" className="hover:text-amber-400 transition-colors">Mindful Journal</Link></li>
            </ul>
          </div>

          {/* Wellness Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Wellness Disclaimer</h4>
            <p className="text-xs text-zen-400 leading-relaxed bg-zen-950/60 p-3.5 rounded-xl border border-zen-800">
              Yoga Life provides general educational wellness guidance. It is not intended to diagnose, treat, or replace professional medical advice. Always consult your healthcare provider before beginning any new exercise routine.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-zen-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zen-500">
          <p>© {new Date().getFullYear()} Yoga Life Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Learn</span>
            <span>•</span>
            <span>Breathe</span>
            <span>•</span>
            <span>Practice</span>
            <span>•</span>
            <span>Transform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
