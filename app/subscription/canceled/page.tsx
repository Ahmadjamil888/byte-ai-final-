"use client";

import Link from 'next/link';

export default function SubscriptionCanceled() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Subscription Canceled
          </h1>
          <p className="text-gray-300 mb-8">
            No worries! You can always upgrade later when you're ready to unlock more features.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Continue with Free Trial
          </Link>
          
          <Link
            href="/#subscription"
            className="block w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            View Plans Again
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Questions? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
}