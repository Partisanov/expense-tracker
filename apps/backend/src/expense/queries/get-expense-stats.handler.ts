import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpenseStatsQuery } from './get-expense-stats.query';
import { ExpenseRepository } from '../expense.repository';

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

@QueryHandler(GetExpenseStatsQuery)
export class GetExpenseStatsHandler
  implements IQueryHandler<GetExpenseStatsQuery, ExpenseStats>
{
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(query: GetExpenseStatsQuery): Promise<ExpenseStats> {
    const [monthTotal, todayTotal, topCategory] = await Promise.all([
      this.expenseRepository.getMonthTotal(query.userId),
      this.expenseRepository.getTodayTotal(query.userId),
      this.expenseRepository.getTopCategory(query.userId),
    ]);

    return { monthTotal, todayTotal, topCategory };
  }
}
