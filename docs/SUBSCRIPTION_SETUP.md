# Subscription System Setup Guide

This guide will help you set up the complete subscription system with Stripe, Clerk authentication, and PostgreSQL database.

## Prerequisites

1. **Clerk Account**: Set up at [clerk.com](https://clerk.com)
2. **Stripe Account**: Set up at [stripe.com](https://stripe.com)
3. **PostgreSQL Database**: Local or cloud (Supabase, Neon, etc.)

## 1. Database Setup

### Install Dependencies
```bash
npm install @prisma/client prisma
```

### Configure Database URL
Update your `.env.local` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/byte_ai_db?schema=public"
```

### Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

## 2. Stripe Configuration

### Create Products and Prices
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products
3. Create two products:

**Standard Plan**
- Name: "Standard Plan"
- Price: $10/month
- Copy the Price ID to `STRIPE_STANDARD_PRICE_ID`

**Premium Plan**
- Name: "Premium Plan" 
- Price: $50/month
- Copy the Price ID to `STRIPE_PREMIUM_PRICE_ID`

### Set up Webhooks
1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 3. Environment Variables

Complete `.env.local` configuration:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Database
DATABASE_URL="postgresql://..."

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Usage in Your App

### Check Generation Limits
```typescript
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { canGenerateApp, recordAppGeneration } = useSubscription();
  
  const handleGenerateApp = async () => {
    const check = await canGenerateApp();
    if (!check.canGenerate) {
      // Show upgrade modal
      return;
    }
    
    // Generate app...
    await recordAppGeneration("My App", "Create a todo app");
  };
}
```

### Protect Routes with Subscription Guard
```typescript
import SubscriptionGuard from '@/components/SubscriptionGuard';

function PremiumFeature() {
  return (
    <SubscriptionGuard requiresPaid={true}>
      <div>Premium content here</div>
    </SubscriptionGuard>
  );
}
```

### Server-side Protection
```typescript
import { withSubscriptionCheck } from '@/lib/subscription-middleware';

export async function POST(req: NextRequest) {
  return withSubscriptionCheck(req, async (req) => {
    // Your protected API logic here
    return NextResponse.json({ success: true });
  });
}
```

## 5. Database Schema

The system creates these tables:

- **users**: Clerk user data
- **user_subscriptions**: Stripe subscription details
- **user_progress**: App generation tracking
- **generated_apps**: History of generated apps

## 6. Subscription Flow

1. **New User**: Gets 7-day trial with 1 app generation
2. **Trial Expiry**: Must upgrade to Standard plan
3. **Standard Plan**: 20 apps/month for $10
4. **Premium Plan**: Unlimited apps for $50
5. **Billing**: Automatic via Stripe webhooks

## 7. Testing

### Test Mode
- Use Stripe test keys
- Test card: `4242 4242 4242 4242`
- Any future expiry date and CVC

### Webhook Testing
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## 8. Production Deployment

1. Update environment variables with production values
2. Set up production database
3. Configure production webhook endpoint
4. Test subscription flow end-to-end

## 9. Monitoring

- Monitor Stripe Dashboard for payments
- Use Prisma Studio for database inspection
- Check webhook delivery in Stripe Dashboard
- Monitor Clerk Dashboard for user activity

## Troubleshooting

### Common Issues

1. **Database Connection**: Verify DATABASE_URL format
2. **Webhook Failures**: Check endpoint URL and selected events
3. **Price ID Mismatch**: Ensure correct Stripe Price IDs
4. **Clerk Integration**: Verify user ID mapping

### Debug Commands

```bash
# Check database connection
npm run db:studio

# View Prisma schema
npx prisma db pull

# Reset database (development only)
npx prisma db push --force-reset
```