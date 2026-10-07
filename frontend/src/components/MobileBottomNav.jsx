import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlayCircle, Flame, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Home', path: isAuthenticated ? '/dashboard' : '/', icon: Home },
    { label: 'Explore', path: '/yoga', icon: Compass },
    { label: 'Practice', path: '/custom-flow', icon: PlayCircle },
    { label: 'Journey', path: '/journey', icon: Flame },
    { label: 'Profile', path: isAuthenticated ? '/profile' : '/login', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1613]/95 backdrop-blur-xl border-t border-zen-700/40 px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-amber-400 font-semibold scale-105' : 'text-zen-400 hover:text-zen-200'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
