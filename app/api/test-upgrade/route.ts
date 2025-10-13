import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!['free', 'pro', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Update user's public metadata to reflect new plan
    const currentProgress = user.publicMetadata?.progress || {
      userId,
      totalAppsGenerated: 0,
      currentPlanAppsGenerated: 0,
      subscriptionStatus: 'free'
    };

    // Reset monthly counter when upgrading
    const updatedProgress = {
      ...currentProgress,
      subscriptionStatus: plan,
      currentPlanAppsGenerated: 0 // Reset monthly counter
    };

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        progress: updatedProgress
      }
    });

    // Also update Clerk's organization membership to simulate subscription
    // This is for testing purposes - in production, this would be handled by Stripe webhooks
    try {
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          testPlan: plan // Add test plan for simulation
        }
      });
    } catch (error) {
      console.error('Failed to update test plan:', error);
    }

    return NextResponse.json({ 
      success: true, 
      plan,
      message: `Successfully upgraded to ${plan} plan (TEST MODE)`,
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