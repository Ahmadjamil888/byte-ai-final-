"use client";

import { useState, useEffect } from 'react';
import { useUser, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { PricingTable } from '@clerk/nextjs';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import { SubscriptionManager } from '@/lib/subscription';
import { toast } from 'sonner';

interface UserProgress {
  userId: string;
  totalAppsGenerated: number;
  currentPlanAppsGenerated: number;
  subscriptionStatus: 'trial' | 'bronze' | 'silver' | 'gold' | 'expired';
  trialStartDate?: Date;
  lastAppGeneratedAt?: Date;
}

export default function SubscriptionSection() {
  const { user, isLoaded } = useUser();
  const { organization } = useOrganization();
  const { createOrganization } = useOrganizationList();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserProgress();
    }
  }, [isLoaded, user]);

  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      // Get progress from Clerk's user metadata
      const progress = user.publicMetadata?.progress as UserProgress;
      if (progress) {
        setUserProgress(progress);
      } else {
        // Initialize trial for new users
        const initialProgress: UserProgress = {
          userId: user.id,
          totalAppsGenerated: 0,
          currentPlanAppsGenerated: 0,
          subscriptionStatus: 'trial',
          trialStartDate: new Date(),
        };
        setUserProgress(initialProgress);
        
        // Save to Clerk
        await fetch('/api/update-user-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialProgress),
        });
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const getCurrentPlan = () => {
    if (!userProgress) return SUBSCRIPTION_PLANS[0];
    return SubscriptionManager.getCurrentPlan(userProgress.subscriptionStatus);
  };

  const getTrialDaysRemaining = () => {
    if (!userProgress?.trialStartDate) return 0;
    return SubscriptionManager.getTrialDaysRemaining(userProgress.trialStartDate);
  };

  const isTrialExpired = () => {
    if (!userProgress) return false;
    return SubscriptionManager.isTrialExpired(userProgress);
  };

  if (!isLoaded || !user) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Loading...</div>
        </div>
      </section>
    );
  }

  const currentPlan = getCurrentPlan();
  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <section className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Progress Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Your Progress</h2>
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto mb-8">
            <div className="text-2xl font-bold text-orange-500 mb-2">
              {userProgress?.totalAppsGenerated || 0}
            </div>
            <div className="text-gray-300 mb-4">Total Apps Generated</div>
            
            <div className="text-sm text-gray-400">
              Current Plan: <span className="text-white font-medium">{currentPlan.name}</span>
            </div>
            
            {userProgress?.subscriptionStatus === 'trial' && (
              <div className="text-sm text-orange-400 mt-2">
                {trialDaysRemaining > 0 
                  ? `${trialDaysRemaining} days remaining in trial`
                  : 'Trial expired - Upgrade required'
                }
              </div>
            )}
            
            {currentPlan.appLimit && (
              <div className="text-sm text-gray-400 mt-2">
                {userProgress?.currentPlanAppsGenerated || 0} / {currentPlan.appLimit} apps this period
              </div>
            )}
          </div>
        </div>

        {/* Clerk Pricing Table */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300">
            Start building amazing apps with our flexible pricing
          </p>
        </div>

        {/* Use Clerk's built-in PricingTable component */}
        <div className="max-w-6xl mx-auto">
          <PricingTable />
        </div>

        {/* Force upgrade message for expired trial */}
        {isTrialExpired() && (
          <div className="mt-12 text-center">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-red-400 mb-2">Trial Expired</h3>
              <p className="text-red-300 mb-4">
                Your 7-day trial has ended. Please upgrade to continue generating apps.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}