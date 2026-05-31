import { apiFetch } from '@/shared/api';
import type {
  Expense,
  PaginatedExpenses,
  ExpenseStats,
  CreateExpensePayload,
} from './types';

export function getExpenses(
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedExpenses> {
  return apiFetch<PaginatedExpenses>(
    `/expenses?page=${page}&limit=${limit}`,
  );
}

export function getExpenseStats(): Promise<ExpenseStats> {
  return apiFetch<ExpenseStats>('/expenses/stats');
}

export function createExpense(
  payload: CreateExpensePayload,
): Promise<Expense> {
  return apiFetch<Expense>('/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateExpense(
  id: string,
  payload: Partial<CreateExpensePayload>,
): Promise<Expense> {
  return apiFetch<Expense>(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteExpense(id: string): Promise<void> {
  return apiFetch<void>(`/expenses/${id}`, {
    method: 'DELETE',
  });
}
