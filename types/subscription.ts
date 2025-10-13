export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  appLimit: number | null; // null means unlimited
}

export interface UserProgress {
  userId: string;
  totalAppsGenerated: number;
  currentPlanAppsGenerated: number;
  subscriptionStatus: 'free' | 'pro' | 'premium' | 'expired';
  trialStartDate?: Date;
  lastAppGeneratedAt?: Date;
}

export interface UserProject {
  id: string;
  name: string;
  description: string;
  sandboxId?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  planUsed: string;
  isActive: boolean;
}

// Clerk plans mapping - these should match your Clerk dashboard plan names
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    duration: 'forever',
    features: [
      '1 app generation',
      'Basic templates',
      'Community support',
      'No credit card required'
    ],
    appLimit: 1
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 19,
    duration: 'per month',
    features: [
      '25 app generations per month',
      'All templates & themes',
      'Priority support',
      'Custom styling options',
      'Export source code',
      'Advanced AI models'
    ],
    appLimit: 25
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 49,
    duration: 'per month',
    features: [
      'Unlimited app generations',
      'All templates & premium themes',
      'Priority support',
      'Advanced customization',
      'White-label options',
      'API access',
      'Team collaboration',
      'Custom integrations'
    ],
    appLimit: null
  }
];

// Available AI Models for Groq API
export const AI_MODELS = [
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B',
    description: 'Most capable model for complex tasks',
    provider: 'groq'
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    description: 'Fast and efficient for most tasks',
    provider: 'groq'
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    description: 'Great for code generation',
    provider: 'groq'
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B',
    description: 'Optimized for instruction following',
    provider: 'groq'
  }
];