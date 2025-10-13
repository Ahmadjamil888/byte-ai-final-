import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionManagerServer } from '@/lib/subscription-server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.warn('No userId found in auth() for sync-user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This will create user progress if it doesn't exist, or return existing progress
    const progress = await SubscriptionManagerServer.getUserProgress(userId);

    return NextResponse.json({ 
      success: true,
      progress 
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}