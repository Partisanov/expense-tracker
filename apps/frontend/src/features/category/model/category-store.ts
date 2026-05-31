'use client';

import { create } from 'zustand';
import type { Category } from '../api/types';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
}));
