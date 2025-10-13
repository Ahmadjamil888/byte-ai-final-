"use client";

import { loadStripe } from '@stripe/stripe-js';

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Client-safe price IDs
export const STRIPE_PRICE_IDS = {
  standard: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID,
  premium: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
};