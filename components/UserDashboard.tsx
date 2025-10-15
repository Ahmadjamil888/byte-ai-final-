"use client";

import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import { SubscriptionManager } from '@/lib/subscription';
import { useUser } from '@clerk/nextjs';

export default function UserDashboard() {
  const { user } = useUser();
  const { progress } = useSubscription();

  if (!user || !progress) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const currentPlan = SubscriptionManager.getCurrentPlan(progress.subscriptionStatus);
  const trialDaysRemaining = progress.trialStartDate ? SubscriptionManager.getTrialDaysRemaining(progress.trialStartDate) : 0;
  const isTrialExpired = SubscriptionManager.isTrialExpired(progress);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Your Account</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          progress.subscriptionStatus === 'free'
            ? 'bg-blue-500/20 text-blue-400'
            : progress.subscriptionStatus === 'pro'
            ? 'bg-orange-500/20 text-orange-400'
            : progress.subscriptionStatus === 'premium'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {currentPlan.name}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">
            {progress.totalAppsGenerated}
          </div>
          <div className="text-sm text-gray-400">Total Apps</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {currentPlan.appLimit 
              ? `${progress.currentPlanAppsGenerated}/${currentPlan.appLimit}`
              : progress.currentPlanAppsGenerated
            }
          </div>
          <div className="text-sm text-gray-400">This Period</div>
        </div>
      </div>

      {progress.subscriptionStatus === 'free' && (
        <div className={`p-3 rounded-lg ${
          isTrialExpired 
            ? 'bg-red-500/20 border border-red-500/30' 
            : 'bg-blue-500/20 border border-blue-500/30'
        }`}>
          <div className={`text-sm font-medium ${
            isTrialExpired ? 'text-red-400' : 'text-blue-400'
          }`}>
            {isTrialExpired ? 'Trial Expired' : `${trialDaysRemaining} days left in trial`}
          </div>
          {isTrialExpired && (
            <div className="text-xs text-red-300 mt-1">
              Upgrade to Pro plan to continue
            </div>
          )}
        </div>
      )}

      {currentPlan.appLimit && progress.currentPlanAppsGenerated >= currentPlan.appLimit && (
        <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
          <div className="text-sm font-medium text-orange-400">
            Monthly limit reached
          </div>
          <div className="text-xs text-orange-300 mt-1">
            {progress.subscriptionStatus === 'pro' 
              ? 'Upgrade to Premium for unlimited apps'
              : 'Limit resets next billing cycle'
            }
          </div>
        </div>
      )}

      {progress.lastAppGeneratedAt && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Last app generated: {new Date(progress.lastAppGeneratedAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}