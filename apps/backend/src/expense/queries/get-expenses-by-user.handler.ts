import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpensesByUserQuery } from './get-expenses-by-user.query';
import { ExpenseRepository } from '../expense.repository';
import { ExpenseWithCategory } from '../commands/create-expense.handler';

export interface PaginatedExpenses {
  items: ExpenseWithCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@QueryHandler(GetExpensesByUserQuery)
export class GetExpensesByUserHandler
  implements IQueryHandler<GetExpensesByUserQuery, PaginatedExpenses>
{
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(query: GetExpensesByUserQuery): Promise<PaginatedExpenses> {
    const [items, total] = await Promise.all([
      this.expenseRepository.findByUserId(
        query.userId,
        query.page,
        query.limit,
      ),
      this.expenseRepository.countByUserId(query.userId),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }
}
