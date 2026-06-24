'use client';

import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, Settings, HelpCircle, Calendar, Trophy, Target, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      onClick: () => {
        router.push('/profile');
        setShowDropdown(false);
      },
    },
    {
      icon: Target,
      label: 'My Habits',
      onClick: () => {
        router.push('/habits');
        setShowDropdown(false);
      },
    },
    {
      icon: BarChart3,
      label: 'Progress',
      onClick: () => {
        router.push('/progress');
        setShowDropdown(false);
      },
    },
    {
      icon: Calendar,
      label: 'My Goals',
      onClick: () => {
        router.push('/goals');
        setShowDropdown(false);
      },
    },
    {
      icon: Trophy,
      label: 'Achievements',
      onClick: () => {
        router.push('/achievements');
        setShowDropdown(false);
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        router.push('/profile');
        setShowDropdown(false);
      },
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: () => {
        window.open('https://github.com/your-repo/issues', '_blank');
        setShowDropdown(false);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-slate-700 shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-slate-700 shadow-sm font-sans">
            {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="text-xs font-semibold text-slate-200 leading-tight">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username}
          </div>
          <div className="text-[10px] text-slate-500 truncate max-w-[120px] font-medium mt-0.5">
            {user.email}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 py-2 z-20 animate-scale-in">
            <div className="px-4 py-3 border-b border-slate-800/80">
              <div className="text-sm font-bold text-slate-100">
                {user.username}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {user.email}
              </div>
            </div>

            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                >
                  <item.icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800/80 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
