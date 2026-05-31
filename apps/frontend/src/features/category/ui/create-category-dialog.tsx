'use client';

import { useState } from 'react';
import { createCategory } from '../api';
import { useCategoryStore } from '../model';
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
import { Plus } from 'lucide-react';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b',
];

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const categories = useCategoryStore((s) => s.categories);

  function resetForm() {
    setName('');
    setColor('');
    setIcon('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const newCategory = await createCategory({
        name: name.trim(),
        color: color || undefined,
        icon: icon.trim() || undefined,
      });
      setCategories([...categories, newCategory]);
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
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-1 size-4" />
        Add Category
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              placeholder="Food & Drinks"
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
            <Label htmlFor="cat-icon">Icon key (optional)</Label>
            <Input
              id="cat-icon"
              placeholder="e.g. food-drinks"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Maps to an emoji in the UI. Built-in: food-drinks, transport, shopping, entertainment, health
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
