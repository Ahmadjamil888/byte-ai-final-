"use client";

// Clerk-only build: provide a no-op Stripe loader so builds don't require '@stripe/stripe-js'
export const getStripe = async () => {
  return null as any;
};

// Client-safe price IDs
export const STRIPE_PRICE_IDS = {
  standard: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID,
  premium: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
};