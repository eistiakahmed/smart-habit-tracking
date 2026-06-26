'use client';

import { memo } from 'react';
import { User } from '@/types';
import { useSyncExternalStore } from 'react';
import { formatLocalDate } from '@/lib/utils';

interface GreetingSectionProps {
  user: User;
  serverTodayDate: string;
}

function getGreeting(name: string, hour: number) {
  const g =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : hour >= 17 && hour < 21
          ? 'Good evening'
          : 'Good night';
  return `${g}, ${name} 👋`;
}

const subscribeToClientSnapshot = () => () => {};

const GreetingSection = memo(({ user, serverTodayDate }: GreetingSectionProps) => {
  const displayName = user?.firstName || user?.username || 'there';
  const greeting = useSyncExternalStore(
    subscribeToClientSnapshot,
    () => getGreeting(displayName, new Date().getHours()),
    () => `Welcome back, ${displayName} 👋`
  );

  // Use serverTodayDate as the server snapshot so SSR and client initial render agree.
  const todayDate = useSyncExternalStore(
    subscribeToClientSnapshot,
    () => formatLocalDate(),
    () => serverTodayDate
  );

  return (
    <div className="px-4 sm:px-0 pt-6 sm:pt-0 mb-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{greeting}</h2>
        <p className="text-slate-400 text-sm">{todayDate}</p>
      </div>
    </div>
  );
});

GreetingSection.displayName = 'GreetingSection';

export default GreetingSection;
