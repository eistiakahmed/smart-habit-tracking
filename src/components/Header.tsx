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
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm">
            {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-700 leading-tight">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username}
          </div>
          <div className="text-xs text-gray-500 truncate max-w-[120px]">
            {user.email}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {user.username}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user.email}
              </div>
            </div>

            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <item.icon className="w-4 h-4 text-gray-500" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
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
