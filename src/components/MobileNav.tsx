'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Target, TrendingUp, Trophy, User, Dna, Wallet, Zap, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { icon: Home,       label: 'Home',         href: '/' },
  { icon: Target,     label: 'Habits',       href: '/habits' },
  { icon: TrendingUp, label: 'Progress',     href: '/progress' },
  { icon: Trophy,     label: 'Achievements', href: '/achievements' },
  { icon: Dna,        label: 'DNA',          href: '/habit-dna' },
  { icon: Wallet,     label: 'Economy',      href: '/economy' },
  { icon: Zap,        label: 'Energy',       href: '/energy-scheduling' },
  { icon: Clock,      label: 'Time Machine', href: '/time-machine' },
  { icon: User,       label: 'Profile',      href: '/profile' },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAuth();

  if (loading || !isAuthenticated || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Frosted Glass Dark Navigation Panel */}
      <div className="bg-slate-950/75 backdrop-blur-xl border-t border-slate-900/80 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-stretch h-16">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 relative active:scale-95 transition-all duration-150 cursor-pointer"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active Background Pill with subtle neon shadow */}
                {isActive && (
                  <span className="absolute top-2 w-11 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 shadow-[0_0_12px_rgba(14,165,233,0.15)]" />
                )}

                {label === 'Profile' && user ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-5 h-5 rounded-full object-cover relative z-10 border transition-all duration-150"
                      style={{
                        borderColor: isActive ? '#0ea5e9' : '#475569',
                      }}
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white text-[8px] font-extrabold relative z-10 border transition-all duration-150 font-sans"
                      style={{
                        borderColor: isActive ? '#0ea5e9' : '#475569',
                      }}
                    >
                      {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )
                ) : (
                  <Icon
                    className="w-[20px] h-[20px] relative z-10 transition-colors duration-150"
                    style={{
                      color: isActive ? '#0ea5e9' : '#64748b',
                      strokeWidth: isActive ? 2.5 : 1.8,
                    }}
                  />
                )}
                <span
                  className="text-[9px] font-bold uppercase tracking-wider relative z-10 transition-colors duration-150"
                  style={{ color: isActive ? '#0ea5e9' : '#64748b' }}
                >
                  {label}
                </span>

                {/* Active Dot */}
                {isActive && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_#0ea5e9]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
