import { apiFetch } from '@/shared/api';
import type { Category } from './types';

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}

export function createCategory(data: {
  name: string;
  color?: string;
  icon?: string;
}): Promise<Category> {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(
  id: string,
  data: { name?: string; color?: string; icon?: string },
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
