import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, AlertCircle, Sparkles, Check } from 'lucide-react';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'None', color: 'bg-zen-800' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to terms and conditions to proceed');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        phone_number: phoneNumber || null,
        password,
        confirm_password: confirmPassword,
      });
      // Redirect to onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl bg-[#0d1714] border border-zen-700/40 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 mb-6 relative z-10">
          <span className="text-3xl">🌱</span>
          <h2 className="text-3xl font-serif font-bold text-white">Begin Your Practice</h2>
          <p className="text-xs text-zen-400">Join the Yoga Life 30-Day transformation journey</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zen-300 block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Sharma"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-zen-300 block mb-1.5">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zen-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
              />
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-zen-400">
                  <span>Strength: {strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-zen-950 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-zen-800'}`} />
                  <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-zen-800'}`} />
                  <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-zen-800'}`} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-zen-300 block mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zen-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/50 text-white text-sm focus:outline-none focus:border-amber-400/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 rounded bg-zen-950 border-zen-700 text-zen-600 focus:ring-0"
            />
            <label htmlFor="terms" className="text-xs text-zen-400">
              I agree to the mindful wellness terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            {isLoading ? 'Creating Account...' : 'Create Account & Start Onboarding ➔'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zen-400">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
