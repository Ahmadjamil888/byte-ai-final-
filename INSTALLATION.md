# 🚀 Byte AI Installation Guide

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database & Subscription System
```bash
npm run setup
```

This will:
- ✅ Connect to your Railway PostgreSQL database
- ✅ Create all necessary tables (users, subscriptions, progress, apps)
- ✅ Verify Stripe and Clerk configuration
- ✅ Generate Prisma client

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the System
Visit: `http://localhost:3000/test-subscription`

## What's Included

### 🗄️ Database (Railway PostgreSQL)
- **users**: Clerk user data with email
- **user_subscriptions**: Stripe subscription details, trial tracking
- **user_progress**: App generation limits and usage
- **generated_apps**: Complete history of generated apps

### 💳 Subscription Plans
- **Trial**: 7 days, 1 app generation, free
- **Standard**: $10/month, 20 apps/month  
- **Premium**: $50/month, unlimited apps

### 🔐 Authentication & Progress
- Clerk authentication integration
- Automatic user sync on login
- Progress saved permanently in database
- Usage limits enforced per plan

## Environment Variables

Your `.env.local` is already configured with:

```env
# Railway PostgreSQL Database
DATABASE_URL="postgresql://postgres:aZeqxnEJieuIwGKuHNzxxQDenuPwAfVi@${RAILWAY_PRIVATE_DOMAIN}:5432/railway"

# Clerk Authentication  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
```

## Usage Examples

### Check if User Can Generate Apps
```typescript
import { useSubscription } from '@/hooks/useSubscription';

const { canGenerateApp, recordAppGeneration } = useSubscription();

const result = await canGenerateApp();
if (result.canGenerate) {
  await recordAppGeneration("My App", "Create a todo app");
}
```

### Protect Premium Features
```typescript
import SubscriptionGuard from '@/components/SubscriptionGuard';

<SubscriptionGuard requiresPaid={true}>
  <PremiumFeature />
</SubscriptionGuard>
```

### Show User Progress
```typescript
import UserDashboard from '@/components/UserDashboard';

<UserDashboard /> // Shows plan, usage, trial status
```

## Database Commands

```bash
# View database in browser
npm run db:studio

# Push schema changes
npm run db:push

# Generate Prisma client
npm run db:generate
```

## Testing

1. **Sign up** as new user → Gets 7-day trial automatically
2. **Generate apps** → Usage tracked in database  
3. **Hit limits** → Upgrade prompts appear
4. **Subscribe** → Stripe checkout flow
5. **Check progress** → All data persisted

## Production Deployment

1. Update `DATABASE_URL` with production Railway database
2. Set production Stripe keys and webhook endpoint
3. Configure Clerk for production domain
4. Run `npm run setup` on production server

## Troubleshooting

### Database Issues
```bash
# Check connection
npm run db:studio

# Reset database (dev only)
npx prisma db push --force-reset
```

### Stripe Issues
- Verify price IDs in Stripe Dashboard
- Check webhook endpoint is accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`

### Clerk Issues  
- Verify publishable key and secret key
- Check domain configuration in Clerk Dashboard

## Support

The system automatically:
- ✅ Creates trial users on first login
- ✅ Tracks app generation limits  
- ✅ Handles subscription upgrades/downgrades
- ✅ Resets monthly counters via Stripe webhooks
- ✅ Saves all progress in Railway PostgreSQL

Everything is ready to use! 🎉