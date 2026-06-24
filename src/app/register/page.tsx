'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus, Upload, X, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const validatePassword = (pwd: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }
    if (!/\W/.test(pwd)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setLoading(true);

    try {
      await register({
        username,
        email,
        password,
        firstName,
        lastName,
        avatar: avatarFile,
      });

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-8 sm:py-12 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full page-enter relative z-10">
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">

          <div className="text-center mb-5 sm:mb-8">
            <div className="w-11 h-11 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-purple-400/20 shadow-[0_0_24px_rgba(168,85,247,0.2)]">
              <UserPlus className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">Create <span className="gradient-text">Account</span></h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2">Start your habit journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Avatar upload */}
            <div className="flex justify-center mb-1">
              <div className="relative">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-700 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                    >
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 hover:bg-slate-900/50 transition-colors bg-slate-950/20">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                    <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-semibold">Avatar</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div>
                <label htmlFor="firstName" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username *
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium"
                placeholder="johndoe"
              />
              <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-medium">3+ chars, letters, numbers, -_</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 pr-10 sm:pr-12 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(c => !c)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-medium">8+ chars, upper, lower, number, special</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 pr-10 sm:pr-12 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(c => !c)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 sm:p-3 text-red-400 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow bg-gradient-to-r from-purple-500 to-sky-500 text-white py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(168,85,247,0.15)] active:scale-[0.98] mt-2 sm:mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center border-t border-slate-800/80 pt-4 sm:pt-5">
            <p className="text-xs sm:text-sm text-slate-400">
              Already have an account?{' '}
              <a href="/login" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
