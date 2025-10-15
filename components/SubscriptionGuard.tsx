"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Protect } from '@clerk/nextjs';
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import { toast } from 'sonner';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiresPlan?: 'bronze' | 'silver' | 'gold'; // Specific plan required
  requiresAnyPaid?: boolean; // If true, blocks trial users
  onUpgradeRequired?: () => void;
}

export default function SubscriptionGuard({ 
  children, 
  requiresPlan,
  requiresAnyPaid = false,
  onUpgradeRequired 
}: SubscriptionGuardProps) {
  const { user } = useUser();
  const { progress, canGenerateApp } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  let gatedChildren = children;
  if (requiresPlan) {
    gatedChildren = (
      <Protect
        plan={requiresPlan}
        fallback={
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              {requiresPlan.charAt(0).toUpperCase() + requiresPlan.slice(1)} Plan Required
            </h3>
            <p className="text-gray-300 mb-6">
              This feature requires a {requiresPlan} subscription or higher.
            </p>
            <button
              onClick={() => (window.location.href = '/pricing')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        }
      >
        {children}
      </Protect>
    );
  }

  useEffect(() => {
    const run = async () => {
      if (!progress) return;

      // Check if user needs any paid plan (treat 'free' as trial)
      if (requiresAnyPaid && progress.subscriptionStatus === 'free') {
        setShowUpgradeModal(true);
        onUpgradeRequired?.();
        return;
      }

      const result = await canGenerateApp();
      if (!result.canGenerate) {
        setShowUpgradeModal(true);
        onUpgradeRequired?.();
      }
    };

    run();
  }, [progress, requiresAnyPaid, canGenerateApp, onUpgradeRequired]);

  if (showUpgradeModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
          <h3 className="text-2xl font-bold text-white mb-4">
            {progress?.subscriptionStatus === 'free' && requiresAnyPaid
              ? 'Premium Feature'
              : 'Upgrade Required'
            }
          </h3>
          
          <p className="text-gray-300 mb-6">
            {progress?.subscriptionStatus === 'free' && requiresAnyPaid
              ? 'This feature requires a paid subscription.'
              : progress?.subscriptionStatus === 'expired'
              ? 'Your trial has expired. Please upgrade to continue generating apps.'
              : 'You\'ve reached your generation limit. Upgrade to continue.'
            }
          </p>

          <div className="text-center">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              View Pricing Plans
            </button>
          </div>

          <button
            onClick={() => setShowUpgradeModal(false)}
            className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return <>{gatedChildren}</>;
}