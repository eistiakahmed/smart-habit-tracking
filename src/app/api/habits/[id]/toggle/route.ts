import { NextResponse } from 'next/server';
import { makeAuthenticatedRequest } from '@/lib/server-auth';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await makeAuthenticatedRequest(`/habits/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({}),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle habit';
    return NextResponse.json({ message }, { status: 500 });
  }
}
