import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Navbar';       // Left sidebar — authenticated users
import TopNavbar from './components/TopNavbar';  // Top navbar  — guest users
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ExploreYogaPage from './pages/ExploreYogaPage';
import PoseDetailPage from './pages/PoseDetailPage';
import CustomFlowBuilderPage from './pages/CustomFlowBuilderPage';
import GuidedPracticePage from './pages/GuidedPracticePage';
import JourneyPage from './pages/JourneyPage';
import AchievementsPage from './pages/AchievementsPage';
import AwarenessPage from './pages/AwarenessPage';
import AnalyticsHistoryPage from './pages/AnalyticsHistoryPage';
import JournalPage from './pages/JournalPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AssistantPage from './pages/AssistantPage';
import AdminPage from './pages/AdminPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1311]">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// All routes (shared between both layouts)
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/yoga" element={<ExploreYogaPage />} />
    <Route path="/yoga/:id" element={<PoseDetailPage />} />
    <Route path="/awareness" element={<AwarenessPage />} />
    <Route path="/awareness/:id" element={<AwarenessPage />} />
    <Route path="/assistant" element={<AssistantPage />} />

    {/* Practice Runner (Full Screen Mode) */}
    <Route path="/practice" element={<GuidedPracticePage />} />
    <Route path="/practice/:sessionId" element={<GuidedPracticePage />} />

    {/* Protected Routes */}
    <Route path="/onboarding"   element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
    <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/custom-flow"  element={<ProtectedRoute><CustomFlowBuilderPage /></ProtectedRoute>} />
    <Route path="/journey"      element={<ProtectedRoute><JourneyPage /></ProtectedRoute>} />
    <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
    <Route path="/history"      element={<ProtectedRoute><AnalyticsHistoryPage /></ProtectedRoute>} />
    <Route path="/progress"     element={<ProtectedRoute><AnalyticsHistoryPage /></ProtectedRoute>} />
    <Route path="/journal"      element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
    <Route path="/favorites"    element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
    <Route path="/profile"      element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
    <Route path="/settings"     element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
    <Route path="/admin"        element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // While auth state is resolving, show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1311]">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── AUTHENTICATED: Left sidebar layout ──────────────────────────────────
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen selection:bg-zen-600 selection:text-white">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    );
  }

  // ── GUEST: Original top navbar layout ───────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col selection:bg-zen-600 selection:text-white">
      {/* Original horizontal top navbar */}
      <TopNavbar />

      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
