"use client";

import { useUser } from '@clerk/nextjs';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionManager } from '@/lib/subscription';

export default function SubscriptionTest() {
  const { user } = useUser();
  const { progress } = useSubscription();

  if (!user || !progress) {
    return <div>Loading...</div>;
  }

  const currentPlan = SubscriptionManager.getCurrentPlan(progress.subscriptionStatus);
  const canGenerate = SubscriptionManager.canGenerateBasedOnLimits(progress);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-bold mb-2">Subscription Test</h3>
      <div className="text-sm text-gray-300 space-y-1">
        <p>User: {user.emailAddresses[0]?.emailAddress}</p>
        <p>Plan: {currentPlan.name}</p>
        <p>Apps Generated: {progress.currentPlanAppsGenerated}</p>
        <p>Can Generate: {canGenerate.canGenerate ? '✅' : '❌'}</p>
        {canGenerate.reason && <p>Reason: {canGenerate.reason}</p>}
      </div>
    </div>
  );
}