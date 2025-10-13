import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionManagerServer } from '@/lib/subscription-server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appName, prompt } = await req.json();

    if (!appName || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user can generate app first
    const canGenerate = await SubscriptionManagerServer.canGenerateApp(userId);
    if (!canGenerate.canGenerate) {
      return NextResponse.json({ error: canGenerate.reason }, { status: 403 });
    }

    // Record the app generation
    const progress = await SubscriptionManagerServer.incrementAppGeneration(userId, appName, prompt);

    return NextResponse.json({ 
      success: true,
      progress 
    });
  } catch (error) {
    console.error('Error recording app generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}