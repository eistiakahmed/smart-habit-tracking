'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Save, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAvatarPreview(user.avatar || '');
    }
  }, [authLoading, isAuthenticated, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setMessage('Only image files are allowed');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      let avatarUrl = user?.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.data?.user?.avatar) {
          avatarUrl = data.data.user.avatar;
        }
      }

      const updatedUser = await api.updateProfile({
        firstName,
        lastName,
        avatar: avatarUrl,
        timezone,
      });

      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Profile Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 page-enter">
        <div className="glass-panel rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 border-b border-slate-800/40 pb-6">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-slate-700 shadow-md">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-sky-500 text-slate-950 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-400 transition-colors shadow-lg border border-slate-950">
                <Camera className="w-4.5 h-4.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-center sm:text-left mt-2">
              <h2 className="text-xl font-black text-white tracking-tight">{user?.username}</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
          </div>

          <div className="mb-8">
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

          {message && (
            <div className={`mb-6 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
              message.includes('success')
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Logout
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)] btn-glow"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="mt-8 glass-panel rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
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
      </main>
    </div>
  );
}
