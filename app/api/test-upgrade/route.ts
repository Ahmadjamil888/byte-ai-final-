import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId || !['free', 'pro', 'premium'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // In test mode, we just update the user's metadata to simulate the plan change
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Update user's public metadata to reflect the new plan
    const progress = user.publicMetadata?.progress as any || {
      userId,
      totalAppsGenerated: 0,
      currentPlanAppsGenerated: 0,
      subscriptionStatus: 'free'
    };

    // Reset monthly counter when upgrading
    const updatedProgress = {
      ...progress,
      subscriptionStatus: planId,
      currentPlanAppsGenerated: 0, // Reset monthly counter
    };

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        progress: updatedProgress
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully upgraded to ${planId} plan (Test Mode)`,
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error upgrading plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}