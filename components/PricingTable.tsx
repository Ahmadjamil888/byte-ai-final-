"use client";

import { PricingTable as ClerkPricingTable } from '@clerk/nextjs';

export default function PricingTable() {
  return (
    <div className="max-w-6xl mx-auto">
      <ClerkPricingTable />
    </div>
  );
}