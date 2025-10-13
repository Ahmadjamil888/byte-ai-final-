import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionManagerServer } from '@/lib/subscription-server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progress = await SubscriptionManagerServer.getUserProgress(userId);
    const canGenerate = await SubscriptionManagerServer.canGenerateApp(userId);

    return NextResponse.json({
      progress,
      canGenerate: canGenerate.canGenerate,
      reason: canGenerate.reason
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}