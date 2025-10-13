"use client";

import { Protect } from '@clerk/nextjs';

interface PlanProtectedContentProps {
  plan: 'bronze' | 'silver' | 'gold';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PlanProtectedContent({ 
  plan, 
  children, 
  fallback 
}: PlanProtectedContentProps) {
  const defaultFallback = (
    <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2">
        {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Required
      </h3>
      <p className="text-gray-300 mb-4">
        This feature requires a {plan} subscription or higher.
      </p>
      <button
        onClick={() => window.location.href = '/pricing'}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        Upgrade Now
      </button>
    </div>
  );

  return (
    <Protect
      plan={plan}
      fallback={fallback || defaultFallback}
    >
      {children}
    </Protect>
  );
}

// Example usage components
export function BronzeFeature({ children }: { children: React.ReactNode }) {
  return (
    <PlanProtectedContent plan="bronze">
      {children}
    </PlanProtectedContent>
  );
}

export function SilverFeature({ children }: { children: React.ReactNode }) {
  return (
    <PlanProtectedContent plan="silver">
      {children}
    </PlanProtectedContent>
  );
}

export function GoldFeature({ children }: { children: React.ReactNode }) {
  return (
    <PlanProtectedContent plan="gold">
      {children}
    </PlanProtectedContent>
  );
}