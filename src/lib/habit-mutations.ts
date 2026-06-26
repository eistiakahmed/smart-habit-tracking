'use server';

import { makeAuthenticatedRequest } from './server-auth';

export async function toggleHabitCompletion(id: string): Promise<{ todayCompleted: boolean; streak: number }> {
  return makeAuthenticatedRequest(`/habits/${id}/toggle`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}
