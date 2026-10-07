import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Phone, ArrowRight, Sparkles, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage() {
  const { login, googleLogin, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('email'); // email, phone
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.profile && user.profile.is_onboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Mock / Live
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await googleLogin(
        'mock-google-token-2026',
        'yogi.mindful@gmail.com',
        'Mindful Yogi',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      );
      if (user.profile && user.profile.is_onboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setError('');
    setIsLoading(true);

    try {
      const res = await api.sendPhoneOtp(phoneNumber);
      setOtpSent(true);
      if (res.demo_code) setDemoCode(res.demo_code);
      setResendCountdown(60);

      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to send OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return;
    setError('');
    setIsLoading(true);

    try {
      const user = await verifyPhoneOtp(phoneNumber, otpCode);
      if (user.profile && user.profile.is_onboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Quick Fill Demo Login
  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@yogalife.app');
      setPassword('YogaLifeAdmin2026!');
      setActiveTab('email');
    } else {
      setEmail('yogi.mindful@gmail.com');
      setPassword('yoga123456');
      setActiveTab('email');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl bg-[#0d1714] border border-zen-700/40 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8 relative z-10">
          <span className="text-3xl">🧘</span>
          <h2 className="text-3xl font-serif font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-zen-400">Sign in to resume your daily yoga rhythm</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab switcher: Email vs Phone */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-zen-950/80 border border-zen-800 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('email'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'email' ? 'bg-zen-800 text-amber-400 shadow' : 'text-zen-400 hover:text-white'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('phone'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'phone' ? 'bg-zen-800 text-amber-400 shadow' : 'text-zen-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* Email Login Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zen-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-zen-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing In...' : 'Sign In ➔'}
            </button>
          </form>
        )}

        {/* Phone OTP Login Form */}
        {activeTab === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zen-300 block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-1234"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !phoneNumber}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-zen-950 border border-amber-500/30 text-amber-300 text-xs">
                  OTP sent to <strong>{phoneNumber}</strong>
                  {demoCode && <span className="block mt-1 text-emerald-300">Demo Code: {demoCode}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-zen-300 block mb-1.5">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength="6"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm tracking-widest font-mono text-center focus:outline-none focus:border-amber-400/80"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !otpCode}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>

                <div className="flex justify-between items-center text-xs text-zen-400 pt-1">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="hover:text-zen-200"
                  >
                    Change Phone Number
                  </button>
                  {resendCountdown > 0 ? (
                    <span>Resend in {resendCountdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-amber-400 font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zen-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0d1714] px-2 text-zen-500">Or Continue With</span></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-zen-900/80 hover:bg-zen-800 border border-zen-700/60 text-white font-semibold text-xs transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-xs text-zen-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-amber-400 font-semibold hover:underline">
            Create Free Account
          </Link>
        </p>

      </div>
    </div>
  );
}
