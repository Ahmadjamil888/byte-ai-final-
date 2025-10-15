import { NextRequest, NextResponse } from 'next/server';

// Clerk-only mode: this endpoint is disabled. Use Clerk Pricing Table for billing.
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Checkout disabled. Use Clerk billing UI.' }, { status: 501 });
}
