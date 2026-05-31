import { Prisma } from '@prisma/client';

type ExpenseRow = {
  id: string;
  amount: Prisma.Decimal;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
};

export interface ExpenseWithCategory {
  id: string;
  amount: number;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
}

export function toExpenseWithCategory(row: ExpenseRow): ExpenseWithCategory {
  return {
    ...row,
    amount: Number(row.amount),
  };
}
