"use client";

import { PricingTable as ClerkPricingTable } from '@clerk/nextjs';

type PricingTableProps = Record<string, any>;

export default function PricingTable(props: PricingTableProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <ClerkPricingTable {...props} />
    </div>
  );
}