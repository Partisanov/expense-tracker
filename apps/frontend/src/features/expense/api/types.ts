export interface ExpenseCategory {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

export interface Expense {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string;
  category: ExpenseCategory;
}

export interface PaginatedExpenses {
  items: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseStats {
  monthTotal: number;
  todayTotal: number;
  topCategory: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    total: number;
  } | null;
}

export interface CreateExpensePayload {
  amount: number;
  description?: string;
  date?: string;
  categoryId: string;
}
