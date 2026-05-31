'use client';

import { CategoryList, CreateCategoryDialog } from '@/features/category';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage your expense categories
          </p>
        </div>
        <CreateCategoryDialog />
      </div>
      <CategoryList />
    </div>
  );
}
