'use client';

import { create } from 'zustand';
import type { Expense, PaginatedExpenses, ExpenseStats } from '../api/types';

interface ExpenseState {
  expenses: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: ExpenseStats | null;
  loading: boolean;
  setExpenses: (data: PaginatedExpenses) => void;
  setStats: (stats: ExpenseStats) => void;
  setLoading: (loading: boolean) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  stats: null,
  loading: false,
  setExpenses: (data) =>
    set({
      expenses: data.items,
      pagination: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      },
    }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
}));
