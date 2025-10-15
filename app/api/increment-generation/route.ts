import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionManagerServer } from '@/lib/subscription-server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const appName: string = body?.appName || 'Generated App';
    const prompt: string = body?.prompt || '';

    const progress = await SubscriptionManagerServer.incrementAppGeneration(userId, appName, prompt);

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error incrementing generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
