'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Target, TrendingUp, Trophy, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { icon: Home,       label: 'Home',         href: '/' },
  { icon: Target,     label: 'Habits',       href: '/habits' },
  { icon: TrendingUp, label: 'Progress',     href: '/progress' },
  { icon: Trophy,     label: 'Achievements', href: '/achievements' },
  { icon: User,       label: 'Profile',      href: '/profile' },
];

export default function MobileNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAuth();

  if (loading || !isAuthenticated || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      aria-label="Primary mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Frosted glass bar */}
      <div className="relative overflow-hidden bg-slate-950/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/45 border-t border-white/10 shadow-[0_-14px_40px_rgba(0,0,0,0.45)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent after:absolute after:inset-0 after:pointer-events-none after:bg-gradient-to-b after:from-white/[0.07] after:to-transparent">
        <div className="mobile-container flex items-stretch h-[var(--nav-height)] px-1.5">

          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

            return (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                className="touch-target flex flex-col items-center justify-center gap-0.5 flex-1 relative active:scale-95 transition-transform duration-150 cursor-pointer"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >

                {/* ── Animated glass pill ── */}
                {isActive && (
                  <span
                    key={pathname} /* re-mount → re-trigger animation on route change */
                    className="nav-pill-enter nav-pill-shimmer absolute inset-x-1 inset-y-1.5 rounded-xl overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(14,165,233,0.08) 100%)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.20), 0 0 20px rgba(14,165,233,0.25), 0 4px 12px rgba(0,0,0,0.35)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  />
                )}

                {/* ── Icon ── */}
                {label === 'Profile' && user ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-5 h-5 rounded-full object-cover relative z-10 border transition-all duration-200"
                      style={{ borderColor: isActive ? '#0ea5e9' : '#475569' }}
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white text-[8px] font-extrabold relative z-10 border transition-all duration-200 font-sans"
                      style={{ borderColor: isActive ? '#0ea5e9' : '#475569' }}
                    >
                      {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )
                ) : (
                  <Icon
                    className="relative z-10 transition-all duration-200"
                    style={{
                      width:       isActive ? '1.25rem' : '1.15rem',
                      height:      isActive ? '1.25rem' : '1.15rem',
                      color:       isActive ? '#0ea5e9' : '#64748b',
                      strokeWidth: isActive ? 2.5 : 1.8,
                      filter:      isActive ? 'drop-shadow(0 0 6px rgba(14,165,233,0.55))' : 'none',
                    }}
                  />
                )}

                {/* ── Label ── */}
                <span
                  className="relative z-10 text-[8px] font-bold uppercase tracking-wider transition-all duration-200"
                  style={{
                    color:      isActive ? '#0ea5e9' : '#64748b',
                    textShadow: isActive ? '0 0 10px rgba(14,165,233,0.5)' : 'none',
                  }}
                >
                  {label}
                </span>


              </button>
            );
          })}

        </div>
      </div>
    </nav>
  );
}
