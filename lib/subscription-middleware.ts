import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionManager } from '@/lib/subscription';

export async function withSubscriptionCheck(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can generate apps
    const canGenerate = await SubscriptionManager.canGenerateApp(userId);
    
    if (!canGenerate.canGenerate) {
      return NextResponse.json({ 
        error: canGenerate.reason,
        requiresUpgrade: true,
        subscriptionStatus: 'expired'
      }, { status: 403 });
    }

    // If check passes, continue with the original handler
    return handler(req);
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return NextResponse.json(
      { error: 'Subscription check failed' },
      { status: 500 }
    );
  }
}