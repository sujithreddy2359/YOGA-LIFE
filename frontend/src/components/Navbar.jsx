import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Flame, Compass, Calendar, BookOpen,
  Award, Heart, MessageSquare, LogOut, Menu, X,
  ShieldAlert, PlusCircle, ChevronLeft, ChevronRight,
  User, BookMarked, LayoutDashboard
} from 'lucide-react';

export default function Sidebar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  // Main nav links shown in sidebar
  const navLinks = [
    { name: 'Dashboard',     path: '/dashboard',    icon: LayoutDashboard, authRequired: true },
    { name: 'Explore Yoga',  path: '/yoga',         icon: Compass },
    { name: 'Awareness',     path: '/awareness',    icon: BookOpen },
    { name: '30-Day Journey',path: '/journey',      icon: Flame,        authRequired: true },
    { name: 'Custom Flow',   path: '/custom-flow',  icon: PlusCircle,   authRequired: true },
    { name: 'Analytics',     path: '/history',      icon: Calendar,     authRequired: true },
    { name: 'AI Assistant',  path: '/assistant',    icon: MessageSquare },
    { name: 'My Journal',    path: '/journal',      icon: BookMarked,   authRequired: true },
  ];

  const isActive = (path) => location.pathname === path;

  // ── Shared sidebar content (desktop + mobile) ──────────────────────────────
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">

      {/* ── Brand Logo ── */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-zen-700/40 ${collapsed && !isMobile ? 'justify-center px-2' : ''}`}>
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0" onClick={() => isMobile && setMobileOpen(false)}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center shadow-lg shadow-zen-600/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="text-xl">🧘</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-zen-300 transition-colors leading-tight whitespace-nowrap">
                YOGA LIFE
              </span>
              <span className="text-[9px] tracking-widest text-zen-400 font-semibold uppercase whitespace-nowrap leading-none mt-0.5">
                Breathe • Practice • Transform
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {(!collapsed || isMobile) && (
          <p className="px-3 mb-2 text-[10px] font-bold text-zen-500 uppercase tracking-widest">
            Navigation
          </p>
        )}
        {navLinks.map((link) => {
          if (link.authRequired && !isAuthenticated) return null;
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? link.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-gradient-to-r from-zen-700/80 to-zen-800/60 text-amber-400 border border-zen-600/50 shadow-sm'
                  : 'text-zen-300 hover:text-white hover:bg-zen-800/50'
                }
                ${collapsed && !isMobile ? 'justify-center px-2' : ''}
              `}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-amber-400' : 'text-zen-500 group-hover:text-zen-300'}`} />
              {(!collapsed || isMobile) && (
                <span className="truncate">{link.name}</span>
              )}
              {active && (!collapsed || isMobile) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              )}
            </Link>
          );
        })}

        {/* ── Divider + User-only quick links ── */}
        {isAuthenticated && (
          <>
            {(!collapsed || isMobile) && (
              <p className="px-3 pt-4 pb-2 text-[10px] font-bold text-zen-500 uppercase tracking-widest">
                My Space
              </p>
            )}
            {!(!collapsed || isMobile) && <div className="h-px bg-zen-700/40 my-3 mx-2" />}

            <Link
              to="/favorites"
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? 'Favorites' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${isActive('/favorites')
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                  : 'text-zen-300 hover:text-rose-400 hover:bg-zen-800/50'
                }
                ${collapsed && !isMobile ? 'justify-center px-2' : ''}
              `}
            >
              <Heart className={`w-4 h-4 flex-shrink-0 ${isActive('/favorites') ? 'text-rose-400' : 'text-zen-500 group-hover:text-rose-400'}`} />
              {(!collapsed || isMobile) && <span>Favorites</span>}
            </Link>

            <Link
              to="/achievements"
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? 'Achievements' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${isActive('/achievements')
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                  : 'text-zen-300 hover:text-amber-400 hover:bg-zen-800/50'
                }
                ${collapsed && !isMobile ? 'justify-center px-2' : ''}
              `}
            >
              <Award className={`w-4 h-4 flex-shrink-0 ${isActive('/achievements') ? 'text-amber-400' : 'text-zen-500 group-hover:text-amber-400'}`} />
              {(!collapsed || isMobile) && <span>Achievements</span>}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => isMobile && setMobileOpen(false)}
                title={collapsed && !isMobile ? 'Admin' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isActive('/admin')
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
                  }
                  ${collapsed && !isMobile ? 'justify-center px-2' : ''}
                `}
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {(!collapsed || isMobile) && <span>Admin Console</span>}
              </Link>
            )}
          </>
        )}
      </nav>

      {/* ── Bottom: User profile + logout / sign-in ── */}
      <div className="border-t border-zen-700/40 p-3 space-y-2">
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? (user?.full_name || 'Profile') : undefined}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-zen-800/50 hover:bg-zen-700/60 border border-zen-700/40 hover:border-zen-600/60 transition-all
                ${collapsed && !isMobile ? 'justify-center px-2' : ''}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
                {user?.full_name?.charAt(0) || 'Y'}
              </div>
              {(!collapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate" title={user?.full_name}>
                    {user?.full_name || user?.email || 'Logged In User'}
                  </p>
                  <p className="text-[10px] text-amber-400/90 font-medium truncate">
                    {isAdmin ? '👑 Master Admin' : (user?.email || 'Yogi Member')}
                  </p>
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              title={collapsed && !isMobile ? 'Sign Out' : undefined}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-zen-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all
                ${collapsed && !isMobile ? 'justify-center px-2' : ''}
              `}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {(!collapsed || isMobile) && <span>Sign Out</span>}
            </button>
          </>
        ) : (
          <div className={`flex flex-col gap-2 ${collapsed && !isMobile ? 'items-center' : ''}`}>
            {(!collapsed || isMobile) ? (
              <>
                <Link
                  to="/login"
                  onClick={() => isMobile && setMobileOpen(false)}
                  className="block text-center py-2 rounded-xl bg-zen-800/60 border border-zen-700 text-sm font-medium text-zen-200 hover:bg-zen-700/70 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => isMobile && setMobileOpen(false)}
                  className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-zen-600 to-zen-500 text-white text-sm font-semibold hover:from-zen-500 transition-all"
                >
                  Start Free Journey
                </Link>
              </>
            ) : (
              <Link to="/login" title="Sign In" className="p-2 rounded-xl bg-zen-800/60 text-zen-300 hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          DESKTOP SIDEBAR
      ════════════════════════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-[#0c1311]/95 backdrop-blur-xl border-r border-zen-700/40 transition-all duration-300 z-40
          ${collapsed ? 'w-[70px]' : 'w-64'}
        `}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-zen-800 border border-zen-600/60 text-zen-400 hover:text-white hover:bg-zen-700 flex items-center justify-center shadow-lg transition-all"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <SidebarContent />
      </aside>

      {/* ════════════════════════════════════════════════════════
          MOBILE TOP BAR + DRAWER
      ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0c1311]/90 border-b border-zen-700/30 h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zen-600 to-amber-500 flex items-center justify-center">
              <span className="text-lg">🧘</span>
            </div>
            <span className="font-serif text-lg font-bold text-white">YOGA LIFE</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl bg-zen-900 border border-zen-700/40 text-zen-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-[#0c1613]/98 backdrop-blur-2xl border-r border-zen-700/40 z-50 transform transition-transform duration-300
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <SidebarContent isMobile />
        </aside>
      </div>
    </>
  );
}
