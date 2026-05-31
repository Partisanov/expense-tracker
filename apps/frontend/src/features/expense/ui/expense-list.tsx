'use client';

import { useEffect, useCallback, useState } from 'react';
import { getExpenses } from '../api';
import { useExpenseStore } from '../model';
import { ExpenseCard } from './expense-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ExpenseList() {
  const expenses = useExpenseStore((s) => s.expenses);
  const pagination = useExpenseStore((s) => s.pagination);
  const loading = useExpenseStore((s) => s.loading);
  const setExpenses = useExpenseStore((s) => s.setExpenses);
  const setLoading = useExpenseStore((s) => s.setLoading);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(
    async (page: number) => {
      setLoading(true);
      setError('');
      try {
        const data = await getExpenses(page, 10);
        setExpenses(data);
      } catch {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    },
    [setExpenses, setLoading],
  );

  useEffect(() => {
    fetchExpenses(1);
  }, [fetchExpenses]);

  if (loading && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  if (error && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchExpenses(1)}>
          Retry
        </Button>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          No transactions yet. Add your first expense!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchExpenses(pagination.page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchExpenses(pagination.page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
