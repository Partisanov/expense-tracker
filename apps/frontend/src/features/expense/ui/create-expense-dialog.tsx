'use client';

import { useState, useEffect } from 'react';
import { createExpense } from '../api';
import { useExpenseStore } from '../model';
import { getCategories } from '@/features/category';
import type { Category } from '@/features/category';
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
import { Plus } from 'lucide-react';
import { CURRENCY_SYMBOL } from '@/shared/lib';

export function CreateExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setExpenses = useExpenseStore((s) => s.setExpenses);
  const pagination = useExpenseStore((s) => s.pagination);

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(() => {});
    }
  }, [open]);

  function resetForm() {
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !categoryId) return;

    setLoading(true);
    setError('');

    try {
      const newExpense = await createExpense({
        amount: parseFloat(amount),
        description: description || undefined,
        date: date || undefined,
        categoryId,
      });

      setExpenses({
        items: [newExpense, ...useExpenseStore.getState().expenses].slice(
          0,
          pagination.limit,
        ),
        total: pagination.total + 1,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil((pagination.total + 1) / pagination.limit),
      });

      resetForm();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-1 size-4" />
        Add Expense
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({CURRENCY_SYMBOL})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
              <SelectTrigger id="category">
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
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Lunch at cafe"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date (optional)</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
