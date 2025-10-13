import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionManagerServer } from '@/lib/subscription-server';

export async function GET(req: NextRequest) {
  try {
    // Add some debugging
    console.log('API call to check-generation-limit');
    const authResult = await auth();
    console.log('Auth result:', { userId: authResult.userId, sessionId: authResult.sessionId });
    
    const { userId } = authResult;
    
    if (!userId) {
      console.warn('No userId found in auth()');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await SubscriptionManagerServer.canGenerateApp(userId);
    const progress = await SubscriptionManagerServer.getUserProgress(userId);

    return NextResponse.json({
      canGenerate: result.canGenerate,
      reason: result.reason,
      progress,
    });
  } catch (error) {
    console.error('Error checking generation limit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}