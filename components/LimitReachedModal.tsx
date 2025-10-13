'use client';

import { useState } from 'react';
import { UserProgress, SUBSCRIPTION_PLANS } from '@/types/subscription';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress | null;
  limitMessage: string;
}

export default function LimitReachedModal({ 
  isOpen, 
  onClose, 
  progress, 
  limitMessage 
}: LimitReachedModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen || !progress) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === progress.subscriptionStatus) || SUBSCRIPTION_PLANS[0];
  const availableUpgrades = SUBSCRIPTION_PLANS.filter(plan => 
    plan.id !== progress.subscriptionStatus && 
    (plan.appLimit === null || (currentPlan.appLimit !== null && plan.appLimit! > currentPlan.appLimit!))
  );

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      // In test mode, upgrade directly
      const response = await fetch('/api/test-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      
      if (response.ok) {
        alert(`Successfully upgraded to ${planId} plan! (Test Mode)`);
        window.location.reload();
      } else {
        throw new Error('Upgrade failed');
      }
    } catch (error) {
      console.error('Failed to upgrade:', error);
      // Fallback to pricing page
      window.location.href = `/pricing?plan=${planId}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Limit Reached</h3>
            <p className="text-sm text-gray-400">
              {currentPlan.name} • {progress.currentPlanAppsGenerated} / {currentPlan.appLimit || '∞'} apps used
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-3">
            {limitMessage}
          </p>
          {progress.subscriptionStatus === 'free' && (
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-orange-400 font-medium">Free Plan Limit</span>
              </div>
              <p className="text-orange-200 text-sm">
                You've used your 1 free app generation. Upgrade to Pro for 25 apps per month or Premium for unlimited apps!
              </p>
            </div>
          )}
        </div>

        {availableUpgrades.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-300">Upgrade Options:</h4>
            {availableUpgrades.map((plan) => (
              <div 
                key={plan.id}
                className="border border-gray-700 rounded-lg p-4 hover:border-orange-500/50 transition-colors cursor-pointer"
                onClick={() => handleUpgrade(plan.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-medium text-white">{plan.name}</h5>
                    <p className="text-sm text-gray-400">
                      {plan.appLimit === null ? 'Unlimited' : plan.appLimit} apps {plan.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">${plan.price}</span>
                    <span className="text-sm text-gray-400">/{plan.duration.split(' ')[1]}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {plan.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {plan.features.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{plan.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
            disabled={isUpgrading}
          >
            Close
          </button>
          {availableUpgrades.length > 0 && (
            <button
              onClick={() => window.location.href = '/pricing'}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              disabled={isUpgrading}
            >
              {isUpgrading ? 'Redirecting...' : 'View All Plans'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}