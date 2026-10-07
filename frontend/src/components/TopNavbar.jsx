import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass, BookOpen, MessageSquare, Menu, X } from 'lucide-react';

/**
 * TopNavbar — shown only for NON-authenticated (guest) users.
 * Keeps the original horizontal top bar look exactly as before.
 */
export default function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore Yoga',  path: '/yoga',      icon: Compass },
    { name: 'Awareness',     path: '/awareness',  icon: BookOpen },
    { name: 'AI Assistant',  path: '/assistant',  icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0c1311]/85 border-b border-zen-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center shadow-lg shadow-zen-600/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <span className="text-xl">🧘</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-zen-300 transition-colors leading-tight whitespace-nowrap">
              YOGA LIFE
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-zen-400 font-semibold uppercase whitespace-nowrap leading-none mt-0.5">
              Breathe • Practice • Transform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-zen-800/80 text-amber-400 border border-zen-600/50 shadow-sm'
                    : 'text-zen-200 hover:text-white hover:bg-zen-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-zen-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Sign In + Start Journey */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-zen-200 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-zen-600 to-zen-500 hover:from-zen-500 hover:to-zen-400 text-white text-sm font-semibold shadow-lg shadow-zen-600/30 transition-all transform hover:-translate-y-0.5"
          >
            Start Free Journey
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-zen-900 border border-zen-700/40 text-zen-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-t border-zen-800 bg-[#0c1613]/95 backdrop-blur-2xl space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-zen-200 hover:bg-zen-800/60 hover:text-white"
              >
                <Icon className="w-5 h-5 text-zen-400" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-zen-800/60 grid grid-cols-2 gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl bg-zen-900 border border-zen-700 text-sm font-medium text-zen-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl bg-zen-600 text-sm font-semibold text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
