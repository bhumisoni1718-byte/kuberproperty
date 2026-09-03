"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

export function EMICalculator({ defaultAmount = 5000000 }: { defaultAmount?: number }) {
  const [principal, setPrincipal] = useState(defaultAmount);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-6">
      <h3 className="text-lg font-semibold text-navy">Mortgage EMI Calculator</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Loan Amount (₹)</Label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Interest Rate (% p.a.)</Label>
          <Input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Tenure (Years)</Label>
          <Input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>
      <div className="mt-6 grid gap-4 rounded-lg bg-navy/5 p-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-navy/60">Monthly EMI</p>
          <p className="text-xl font-bold text-gold">{formatPrice(emi)}</p>
        </div>
        <div>
          <p className="text-sm text-navy/60">Total Interest</p>
          <p className="text-lg font-semibold text-navy">{formatPrice(totalInterest)}</p>
        </div>
        <div>
          <p className="text-sm text-navy/60">Total Payment</p>
          <p className="text-lg font-semibold text-navy">{formatPrice(totalPayment)}</p>
        </div>
      </div>
    </div>
  );
}
