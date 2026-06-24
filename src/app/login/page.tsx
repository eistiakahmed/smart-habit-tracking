'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Key, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, register } = useAuth();
  const [guestLoading, setGuestLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = async () => {
    setError('');
    setGuestLoading(true);

    const guestEmail = 'guest@habittracker.com';
    const guestPassword = 'Password123!';
    const guestUsername = 'guest';

    try {
      try {
        // Try logging in as guest
        await login({ email: guestEmail, password: guestPassword });
        router.push('/');
        router.refresh();
      } catch (loginErr: any) {
        // If guest user doesn't exist, register them
        await register({
          email: guestEmail,
          password: guestPassword,
          username: guestUsername,
          firstName: 'Guest',
          lastName: 'User',
        });
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start guest session. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030712] flex items-center justify-center px-4 py-8 sm:py-12">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md page-enter">
        {/* Logo/Brand */}
        <div className="text-center mb-5 sm:mb-8">
          <div className="w-11 h-11 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-[0_0_24px_rgba(56,189,248,0.25)] border border-sky-400/20">
            <span className="text-xl sm:text-3xl text-white font-bold font-sans">✓</span>
          </div>
          <h1 className="text-white text-xl sm:text-3xl font-extrabold font-sans tracking-tight mb-1 sm:mb-2">
            Habit <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">Sign in to continue your habit journey</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
          
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5 relative z-10">
            <div>
              <label htmlFor="email" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3.5 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 sm:pl-11 pr-11 py-2.5 sm:py-3.5 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || guestLoading}
              className="w-full btn-glow bg-gradient-to-r from-sky-500 to-purple-600 text-white py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(56,189,248,0.15)] active:scale-[0.98] mt-3 sm:mt-5 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

            <button
              type="button"
              disabled={loading || guestLoading}
              onClick={handleContinueAsGuest}
              className="w-full bg-slate-900/50 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {guestLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300" />
              ) : (
                "Continue as Guest"
              )}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center border-t border-slate-800/80 pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
