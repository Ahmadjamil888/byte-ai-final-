'use client';

import { usicingTable } from '@clerk/nextjs';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import { clerkTheme } from '@/lib/clerk-theme';
import BlackHoleBackground from '@/components/BlackHoleBackground';

export default function PricingPage() {
  return (
    <BlackHoleBackground className="py-20" intensity="medium">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock the power of AI-driven app generation with our flexible pricing plans
          </p>
          
          {/* Test Mode Notice */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/40 rounded-full mb-8 backdrop-blur-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-orange-300 font-medium">Test Mode - No actual payments required</span>
          </div>
        </div>

        {/* Custom Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {SUBSCRIPTION_PLANS.map((plan, index) => (
            <div 
              key={plan.id}
              className={`relative rounded-xl p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.id === 'pro' 
                  ? 'bg-gradient-to-br from-orange-500/10 via-black/80 to-orange-600/10 border-2 border-orange-500/50 shadow-2xl shadow-orange-500/20' 
                  : plan.id === 'premium'
                  ? 'bg-gradient-to-br from-orange-400/15 via-black/85 to-orange-500/15 border-2 border-orange-400/60 shadow-2xl shadow-orange-400/25'
                  : 'bg-gradient-to-br from-gray-800/50 via-black/70 to-gray-900/50 border border-gray-600/50 hover:border-orange-500/30'
              }`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              
              {plan.id === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    🚀 Ultimate
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400 text-lg">/{plan.duration.split(' ')[1] || 'month'}</span>
                </div>
                
                <div className="mb-8">
                  <div className="text-sm text-gray-400 mb-2">App Generations:</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {plan.appLimit === null ? '∞ Unlimited' : plan.appLimit}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={async () => {
                    if (plan.id !== 'free') {
                      try {
                        const response = await fetch('/api/test-upgrade', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ planId: plan.id })
                        });
                        
                        if (response.ok) {
                          alert(`Successfully upgraded to ${plan.name}! (Test Mode)`);
                          window.location.reload();
                        }
                      } catch (error) {
                        console.error('Upgrade failed:', error);
                      }
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    plan.id === 'free'
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 cursor-default'
                      : plan.id === 'pro'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black shadow-lg shadow-orange-400/30'
                  }`}
                  disabled={plan.id === 'free'}
                >
                  {plan.id === 'free' ? 'Get Started Free' : 'Upgrade Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Clerk Pricing Table with Custom Theme */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">Secure Checkout</h2>
            <p className="text-gray-400">Powered by Clerk - Industry standard security</p>
          </div>
          
          <div style={{ 
            maxWidth: '100%', 
            margin: '0 auto',
            '--clerk-color-primary': '#f97316',
            '--clerk-color-background': '#111827',
            '--clerk-color-text': '#ffffff',
            '--clerk-border-radius': '0.5rem'
          } as any}>
            <PricingTable 
              appearance={{
                ...clerkTheme,
                elements: {
                  ...clerkTheme.elements,
                  pricingTable: "bg-gray-900 border border-gray-700 rounded-lg overflow-hidden",
                  pricingTableHeader: "bg-gray-800 border-b border-gray-700 p-4",
                  pricingTableRow: "border-b border-gray-700 hover:bg-gray-800/50 transition-colors",
                  pricingTableCell: "p-4 text-gray-300",
                  pricingTableButton: "bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200",
                }
              }}
            />
          </div>
        </div>
      </div>
    </BlackHoleBackground>
  );
}