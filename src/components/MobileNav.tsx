'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Target, TrendingUp, Trophy, User } from 'lucide-react';

const navItems = [
  { icon: Home,       label: 'Home',         href: '/' },
  { icon: Target,     label: 'Habits',       href: '/habits' },
  { icon: TrendingUp, label: 'Progress',     href: '/progress' },
  { icon: Trophy,     label: 'Achievements', href: '/achievements' },
  { icon: User,       label: 'Profile',      href: '/profile' },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Frosted glass effect */}
      <div className="bg-white/90 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-stretch h-16">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 relative active:scale-90 transition-transform duration-100"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active background pill */}
                {isActive && (
                  <span className="absolute top-2 w-10 h-10 rounded-xl bg-blue-50" />
                )}

                <Icon
                  className="w-[22px] h-[22px] relative z-10 transition-colors duration-150"
                  style={{
                    color: isActive ? '#2563EB' : '#9CA3AF',
                    strokeWidth: isActive ? 2.5 : 1.8,
                  }}
                />
                <span
                  className="text-[10px] font-semibold relative z-10 transition-colors duration-150"
                  style={{ color: isActive ? '#2563EB' : '#9CA3AF' }}
                >
                  {label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
