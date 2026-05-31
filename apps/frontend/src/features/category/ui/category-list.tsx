'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '../api';
import { useCategoryStore } from '../model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryIcon } from '@/shared/lib';

export function CategoryList() {
  const categories = useCategoryStore((s) => s.categories);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const loading = useCategoryStore((s) => s.loading);
  const setLoading = useCategoryStore((s) => s.setLoading);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [setCategories, setLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No categories yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center gap-3 rounded-lg border bg-card p-3"
        >
          <span className="flex size-8 items-center justify-center rounded-md text-lg">
            {getCategoryIcon(category.icon, category.name)}
          </span>
          <span className="text-sm font-medium">{category.name}</span>
          {category.color && (
            <Badge
              variant="outline"
              className="ml-auto size-4 rounded-full border-0 p-0"
              style={{ backgroundColor: category.color }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
