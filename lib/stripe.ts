import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export const PRICE_IDS = {
  standard: process.env.STRIPE_STANDARD_PRICE_ID as string,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID as string,
};
