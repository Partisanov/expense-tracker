'use client';

import { useState } from 'react';
import { updateCategory } from '../api';
import { useCategoryStore } from '../model';
import type { Category } from '../api/types';
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
import { Pencil } from 'lucide-react';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b',
];

export function EditCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color ?? '');
  const [icon, setIcon] = useState(category.icon ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const categories = useCategoryStore((s) => s.categories);

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (v) {
      setName(category.name);
      setColor(category.color ?? '');
      setIcon(category.icon ?? '');
      setError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const updated = await updateCategory(category.id, {
        name: name.trim(),
        color: color || undefined,
        icon: icon.trim() || undefined,
      });
      setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
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
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-cat-name">Name</Label>
            <Input
              id="edit-cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`size-7 rounded-full border-2 transition-colors ${color === c ? 'border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(color === c ? '' : c)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-cat-icon">Icon key</Label>
            <Input
              id="edit-cat-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={50}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
