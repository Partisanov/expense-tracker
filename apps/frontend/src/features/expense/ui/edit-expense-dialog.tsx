'use client';

import { useState, useEffect } from 'react';
import { updateExpense } from '../api';
import { useExpenseStore } from '../model';
import { getCategories } from '@/features/category';
import type { Category } from '@/features/category';
import type { Expense } from '../api/types';
import { ApiError } from '@/shared/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { CURRENCY_SYMBOL } from '@/shared/lib';

export function EditExpenseDialog({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description ?? '');
  const [categoryId, setCategoryId] = useState(expense.categoryId);
  const [date, setDate] = useState(expense.date.slice(0, 10));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setExpenses = useExpenseStore((s) => s.setExpenses);
  const pagination = useExpenseStore((s) => s.pagination);

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(() => {});
    }
  }, [open]);

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (v) {
      setAmount(String(expense.amount));
      setDescription(expense.description ?? '');
      setCategoryId(expense.categoryId);
      setDate(expense.date.slice(0, 10));
      setError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !categoryId) return;

    setLoading(true);
    setError('');

    try {
      const updated = await updateExpense(expense.id, {
        amount: parseFloat(amount),
        description: description || undefined,
        date: date || undefined,
        categoryId,
      });

      const current = useExpenseStore.getState().expenses;
      setExpenses({
        items: current.map((ex) => (ex.id === updated.id ? updated : ex)),
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Pencil className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount ({CURRENCY_SYMBOL})</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
