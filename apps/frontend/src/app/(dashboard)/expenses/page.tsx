'use client';

import { ExpenseList } from '@/features/expense';
import { CreateExpenseDialog } from '@/features/expense';

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            All your expenses
          </p>
        </div>
        <CreateExpenseDialog />
      </div>
      <ExpenseList />
    </div>
  );
}
