import { NextRequest, NextResponse } from 'next/server';

// Clerk-only mode: webhook disabled. Use Clerk billing webhooks if applicable.
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Webhook disabled. Use Clerk billing.' }, { status: 501 });
}
