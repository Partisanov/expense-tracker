'use client';

import { useState } from 'react';
import { deleteCategory } from '../api';
import { useCategoryStore } from '../model';
import type { Category } from '../api/types';
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

export function DeleteCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const categories = useCategoryStore((s) => s.categories);

  async function handleDelete() {
    setLoading(true);
    setError('');

    try {
      await deleteCategory(category.id);
      setCategories(categories.filter((c) => c.id !== category.id));
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
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-foreground">{category.name}</span>?
          Expenses in this category will not be deleted but will lose their category reference.
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
