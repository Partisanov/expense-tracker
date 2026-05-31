'use client';

import { useState } from 'react';
import { deleteExpense } from '../api';
import { useExpenseStore } from '../model';
import type { Expense } from '../api/types';
import { ApiError } from '@/shared/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { formatAmount, CURRENCY_SYMBOL } from '@/shared/lib';

export function DeleteExpenseDialog({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setExpenses = useExpenseStore((s) => s.setExpenses);
  const pagination = useExpenseStore((s) => s.pagination);

  async function handleDelete() {
    setLoading(true);
    setError('');

    try {
      await deleteExpense(expense.id);

      const current = useExpenseStore.getState().expenses;
      const filtered = current.filter((ex) => ex.id !== expense.id);
      setExpenses({
        items: filtered,
        total: pagination.total - 1,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.max(1, Math.ceil((pagination.total - 1) / pagination.limit)),
      });

      setOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setError(''); }}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Trash2 className="size-3.5 text-destructive" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this expense of{' '}
          <span className="font-medium text-foreground">
            {formatAmount(Number(expense.amount))} {CURRENCY_SYMBOL}
          </span>
          {expense.description && (
            <>
              {' '}({expense.description})
            </>
          )}
          ?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
