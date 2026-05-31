'use client';

import { CategoryList } from '@/features/category';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage your expense categories
        </p>
      </div>
      <CategoryList />
    </div>
  );
}
