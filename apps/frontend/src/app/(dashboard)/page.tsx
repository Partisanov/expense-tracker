'use client';

import { ExpenseSummary } from '@/features/expense';
import { ExpenseList } from '@/features/expense';
import { CreateExpenseDialog } from '@/features/expense';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your expense overview
          </p>
        </div>
        <CreateExpenseDialog />
      </div>
      <ExpenseSummary />
      <Separator />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <ExpenseList />
      </div>
    </div>
  );
}
