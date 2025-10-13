"use client";

import { useUser } from '@clerk/nextjs';
import { useSubscription } from '@/hooks/useSubscription';
import UserDashboard from '@/components/UserDashboard';
import SubscriptionSection from '@/components/SubscriptionSection';
import { useState } from 'react';
import { toast } from 'sonner';

export default function TestSubscriptionPage() {
  const { user, isLoaded } = useUser();
  const { progress, recordAppGeneration, canGenerateApp, loading } = useSubscription();
  const [testLoading, setTestLoading] = useState(false);

  const handleTestGeneration = async () => {
    if (!user) return;

    setTestLoading(true);
    try {
      // Check if user can generate
      const check = await canGenerateApp();
      
      if (!check.canGenerate) {
        toast.error(check.reason || 'Cannot generate app');
        return;
      }

      // Record a test app generation
      const success = await recordAppGeneration(
        `Test App ${Date.now()}`,
        'Create a simple test application'
      );

      if (success) {
        toast.success('Test app generation recorded!');
      }
    } catch (error) {
      console.error('Test generation error:', error);
      toast.error('Test failed');
    } finally {
      setTestLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-400">
            You need to be signed in to test the subscription system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Subscription System Test
          </h1>

          {/* User Dashboard */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">User Dashboard</h2>
            <UserDashboard />
          </div>

          {/* Test Generation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Test App Generation</h2>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300 mb-4">
                Test the app generation limits and progress tracking:
              </p>
              
              <button
                onClick={handleTestGeneration}
                disabled={testLoading || loading}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {testLoading || loading ? 'Testing...' : 'Test Generate App'}
              </button>

              {progress && (
                <div className="mt-4 text-sm text-gray-400">
                  <p>Current Plan: {progress.subscriptionStatus}</p>
                  <p>Apps Generated: {progress.currentPlanAppsGenerated}</p>
                  <p>Total Apps: {progress.totalAppsGenerated}</p>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Subscription Plans</h2>
            <SubscriptionSection />
          </div>

          {/* Debug Info */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Debug Information</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Clerk Metadata:</strong> {progress ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Progress Loaded:</strong> {progress ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}