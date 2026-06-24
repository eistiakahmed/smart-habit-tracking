'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2,
  LogOut,
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Clock,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface NotificationSettings {
  habitReminders: boolean;
  achievementAlerts: boolean;
  weeklyReports: boolean;
  challengeUpdates: boolean;
  friendActivity: boolean;
}

interface PrivacySettings {
  showProfile: boolean;
  showStats: boolean;
  allowFriendRequests: boolean;
  showActivity: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('profile');

  // Profile settings
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [bio, setBio] = useState('');

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    habitReminders: true,
    achievementAlerts: true,
    weeklyReports: true,
    challengeUpdates: false,
    friendActivity: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showProfile: false,
    showStats: false,
    allowFriendRequests: false,
    showActivity: false,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setTimezone((user as any).timezone || 'UTC');
      setBio((user as any).bio || '');

      // Load notification and privacy preferences if they exist
      if (user.preferences) {
        if (user.preferences.notifications) {
          setNotifications(prev => ({ ...prev, ...(user.preferences?.notifications || {}) }));
        }
        if (user.preferences.privacy) {
          setPrivacy(prev => ({ ...prev, ...(user.preferences?.privacy || {}) }));
        }
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');

    try {
      const updatedUser = await api.updateProfile({
        firstName,
        lastName,
        timezone,
        bio: bio as any,
      } as any);

      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setMessage('');

    try {
      await api.updateProfile({
        preferences: {
          ...user?.preferences,
          notifications,
        },
      });

      updateUser({ ...user, preferences: { ...user?.preferences, notifications } } as any);
      setMessage('Notification settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    setMessage('');

    try {
      await api.updateProfile({
        preferences: {
          ...user?.preferences,
          privacy,
        },
      });

      updateUser({ ...user, preferences: { ...user?.preferences, privacy } } as any);
      setMessage('Privacy settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a15] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sections = [
    { id: 'profile', icon: UserIcon, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
  ];

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      {/* Background mesh glow */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Section Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-sky-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                  : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {message && (
          <div className={`mb-6 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${
            message.includes('success')
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.includes('success') ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {message}
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl">
              <h2 className="text-base sm:text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-sky-400" />
                Profile Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm"
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-slate-500 mt-1">{bio.length}/500</p>
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0f1d] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
                  >
                    <option value="UTC" className="bg-[#0a0f1d]">UTC</option>
                    <option value="America/New_York" className="bg-[#0a0f1d]">Eastern Time</option>
                    <option value="America/Chicago" className="bg-[#0a0f1d]">Central Time</option>
                    <option value="America/Denver" className="bg-[#0a0f1d]">Mountain Time</option>
                    <option value="America/Los_Angeles" className="bg-[#0a0f1d]">Pacific Time</option>
                    <option value="Europe/London" className="bg-[#0a0f1d]">London (GMT)</option>
                    <option value="Europe/Paris" className="bg-[#0a0f1d]">Central European Time</option>
                    <option value="Asia/Tokyo" className="bg-[#0a0f1d]">Japan Time</option>
                    <option value="Asia/Shanghai" className="bg-[#0a0f1d]">China Time</option>
                    <option value="Asia/Kolkata" className="bg-[#0a0f1d]">India Time</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)] btn-glow"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-5 tracking-tight">Account Information</h3>
              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between border-b border-slate-900/60 pb-3">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Username</span>
                  <span className="text-slate-200 font-bold">{user?.username}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-3">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Email Address</span>
                  <span className="text-slate-200 font-bold">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Member Since</span>
                  <span className="text-slate-200 font-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-400" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Habit Reminders</h4>
                  <p className="text-xs text-slate-500">Receive daily reminders for your habits</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, habitReminders: !prev.habitReminders }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${notifications.habitReminders ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications.habitReminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Achievement Alerts</h4>
                  <p className="text-xs text-slate-500">Get notified when you unlock achievements</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, achievementAlerts: !prev.achievementAlerts }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${notifications.achievementAlerts ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications.achievementAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Weekly Reports</h4>
                  <p className="text-xs text-slate-500">Receive weekly progress summaries</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${notifications.weeklyReports ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications.weeklyReports ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Challenge Updates</h4>
                  <p className="text-xs text-slate-500">Updates on active challenges</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, challengeUpdates: !prev.challengeUpdates }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${notifications.challengeUpdates ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications.challengeUpdates ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Friend Activity</h4>
                  <p className="text-xs text-slate-500">Notifications about friends' activities</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, friendActivity: !prev.friendActivity }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${notifications.friendActivity ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications.friendActivity ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)] btn-glow"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Notifications'}
              </button>
            </div>
          </div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              Privacy Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Public Profile</h4>
                  <p className="text-xs text-slate-500">Allow others to see your profile</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, showProfile: !prev.showProfile }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${privacy.showProfile ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${privacy.showProfile ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Show Stats</h4>
                  <p className="text-xs text-slate-500">Display your stats on public profile</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, showStats: !prev.showStats }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${privacy.showStats ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${privacy.showStats ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Friend Requests</h4>
                  <p className="text-xs text-slate-500">Allow others to send you friend requests</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, allowFriendRequests: !prev.allowFriendRequests }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${privacy.allowFriendRequests ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${privacy.allowFriendRequests ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Show Activity</h4>
                  <p className="text-xs text-slate-500">Display your recent activity to friends</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, showActivity: !prev.showActivity }))}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer ${privacy.showActivity ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${privacy.showActivity ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <button
                onClick={handleSavePrivacy}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)] btn-glow"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Privacy'}
              </button>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}