import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, Phone, Clock, Bell, Shield, Activity, Save, CheckCircle2 } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [primaryGoal, setPrimaryGoal] = useState(user?.profile?.primary_goal || 'General Wellness');
  const [experienceLevel, setExperienceLevel] = useState(user?.profile?.experience_level || 'Beginner');
  const [preferredDuration, setPreferredDuration] = useState(user?.profile?.preferred_duration_minutes || 15);
  const [preferredTime, setPreferredTime] = useState(user?.profile?.preferred_time_of_day || 'Morning');
  const [bio, setBio] = useState(user?.profile?.bio || '');

  // Reminder settings
  const [reminderTime, setReminderTime] = useState('07:00 AM');
  const [reminderDays, setReminderDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const [sessions, setSessions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setPrimaryGoal(user.profile.primary_goal || 'General Wellness');
      setExperienceLevel(user.profile.experience_level || 'Beginner');
      setPreferredDuration(user.profile.preferred_duration_minutes || 15);
      setPreferredTime(user.profile.preferred_time_of_day || 'Morning');
      setBio(user.profile.bio || '');
    }

    api.getReminders().then((rems) => {
      if (rems && rems.length > 0) {
        setReminderTime(rems[0].time_of_day);
        setReminderDays(rems[0].days_of_week || []);
        setReminderEnabled(rems[0].is_enabled);
      }
    }).catch(console.error);

    api.getSessions().then(setSessions).catch(console.error);
  }, [user]);

  const handleToggleDay = (day) => {
    setReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await api.updateProfile({
        primary_goal: primaryGoal,
        experience_level: experienceLevel,
        preferred_duration_minutes: preferredDuration,
        preferred_time_of_day: preferredTime,
        bio
      });

      await api.saveReminder({
        time_of_day: reminderTime,
        days_of_week: reminderDays,
        is_enabled: reminderEnabled
      });

      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-800 border border-zen-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>Account & Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-zen-300 mt-1">
          Manage your practice goals, daily reminders, and security sessions.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile and reminder settings saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* Basic Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-5">
          <h3 className="text-lg font-serif font-bold text-white">Basic Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.full_name || ''}
                className="w-full px-4 py-3 rounded-xl bg-zen-950/60 border border-zen-800 text-zen-300 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl bg-zen-950/60 border border-zen-800 text-zen-300 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zen-400 block mb-1.5">Personal Bio / Intention</label>
            <textarea
              rows="2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What intention brings you to your yoga practice?"
              className="w-full px-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Practice Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-5">
          <h3 className="text-lg font-serif font-bold text-white">Practice Preferences</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Primary Focus Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Relaxation">Relaxation & Calm</option>
                <option value="Focus">Focus & Mental Clarity</option>
                <option value="Flexibility">Flexibility & Mobility</option>
                <option value="Strength">Strength & Core Power</option>
                <option value="Better Sleep">Better Deep Sleep</option>
                <option value="Energy">Energy & Vitality</option>
                <option value="General Wellness">General Wellness</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Preferred Duration</label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Preferred Practice Time</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Custom time">Custom / Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Daily Practice Reminders */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" /> Daily Practice Reminders
              </h3>
              <p className="text-xs text-zen-400">Receive mindful cues to step onto your mat</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zen-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Reminder Time</label>
              <input
                type="text"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                placeholder="07:00 AM"
                className="w-full px-4 py-3 rounded-xl bg-zen-950/80 border border-zen-700/60 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zen-400 block mb-1.5">Active Days</label>
              <div className="flex gap-1.5">
                {daysList.map((day) => {
                  const active = reminderDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-zen-950 border-zen-800 text-zen-500'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-zen-600 to-amber-500 hover:from-zen-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* User Session / Login Activity */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1714] border border-zen-700/50 shadow-xl space-y-4">
        <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Login & Session Activity
        </h3>
        
        <div className="space-y-2.5">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 rounded-2xl bg-zen-950/60 border border-zen-800 flex items-center justify-between text-xs"
            >
              <div>
                <strong className="text-white block">{sess.device_info || 'Browser Session'}</strong>
                <span className="text-zen-400 font-mono text-[11px]">{sess.ip_address || '127.0.0.1'}</span>
              </div>
              <span className="text-zen-400 font-mono text-[11px]">
                {new Date(sess.login_time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
