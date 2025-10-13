# Clerk Subscriptions Integration

This app now uses Clerk's built-in subscription and plan features instead of Stripe and database storage.

## Setup

1. **Configure Clerk Plans**: In your Clerk Dashboard, create three plans:
   - `bronze` - $10/month - 20 app generations
   - `silver` - $25/month - 50 app generations  
   - `gold` - $50/month - Unlimited app generations

2. **Environment Variables**: Only Clerk variables are needed:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **Run Setup**: 
   ```bash
   npm run setup
   ```

## How It Works

### Data Storage
- User progress is stored in Clerk's user metadata
- No database required - everything is in Clerk
- Generated apps are stored in user's private metadata

### Subscription Management
- Uses Clerk's built-in `<PricingTable />` component
- Plan access controlled via Clerk's `<Protect>` component
- Subscription status checked with `has({ plan: 'planName' })`

### Components

#### PricingTable
```tsx
import { PricingTable } from '@clerk/nextjs';

export default function PricingPage() {
  return <PricingTable />;
}
```

#### Plan Protection
```tsx
import { Protect } from '@clerk/nextjs';

// Protect entire components
<Protect plan="gold" fallback={<UpgradePrompt />}>
  <PremiumFeature />
</Protect>

// Or use our helper components
import { GoldFeature } from '@/components/PlanProtectedContent';

<GoldFeature>
  <PremiumContent />
</GoldFeature>
```

#### Server-side Plan Checking
```tsx
import { auth } from '@clerk/nextjs/server';

export default async function ServerComponent() {
  const { has } = await auth();
  
  const hasGoldPlan = has({ plan: 'gold' });
  
  if (!hasGoldPlan) {
    return <div>Gold plan required</div>;
  }
  
  return <PremiumContent />;
}
```

### API Routes

#### Check Generation Limit
```
GET /api/check-generation-limit
```
Returns user progress and whether they can generate apps.

#### Record App Generation
```
POST /api/record-app-generation
Body: { appName: string, prompt: string }
```
Records a new app generation and updates user progress.

#### Update User Progress
```
POST /api/update-user-progress
Body: UserProgress
```
Updates user progress in Clerk metadata.

### Key Features

1. **Automatic Trial**: New users get 7-day trial with 1 app generation
2. **Plan-based Limits**: Bronze (20), Silver (50), Gold (unlimited)
3. **Progress Tracking**: Total apps and current period apps
4. **Clerk Integration**: Uses Clerk's native subscription features
5. **No Database**: All data stored in Clerk user metadata

### Migration Benefits

- ✅ Removed Stripe dependency
- ✅ Removed database dependency (Railway/Prisma)
- ✅ Simplified architecture
- ✅ Native Clerk subscription UI
- ✅ Built-in payment processing
- ✅ Automatic plan management

### Testing

Visit `/test-subscription` to test the subscription system:
- View user dashboard
- Test app generation limits
- See plan restrictions in action

### Plan Names

Make sure your Clerk plans match these IDs:
- `bronze` - Basic paid plan
- `silver` - Mid-tier plan  
- `gold` - Premium plan

The trial is handled automatically and doesn't require a Clerk plan.