'use client';

import type { Expense } from '../api/types';
import { getCategoryIcon } from '@/shared/lib';
import { formatAmount, CURRENCY_SYMBOL } from '@/shared/lib';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const expenseDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (expenseDate.getTime() === today.getTime()) return 'Today';
  if (expenseDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
      <span
        className="flex size-9 items-center justify-center rounded-md text-lg"
        style={
          expense.category.color
            ? { backgroundColor: expense.category.color + '20' }
            : undefined
        }
      >
        {getCategoryIcon(expense.category.icon, expense.category.name)}
      </span>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">
          {expense.description || expense.category.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {expense.category.name}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold">
          -{formatAmount(Number(expense.amount))} {CURRENCY_SYMBOL}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(expense.date)}
        </span>
      </div>
    </div>
  );
}
