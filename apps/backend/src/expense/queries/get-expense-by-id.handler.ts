import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpenseByIdQuery } from './get-expense-by-id.query';
import { ExpenseRepository } from '../expense.repository';
import { ExpenseWithCategory, toExpenseWithCategory } from '../expense-with-category';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@QueryHandler(GetExpenseByIdQuery)
export class GetExpenseByIdHandler
  implements IQueryHandler<GetExpenseByIdQuery, ExpenseWithCategory>
{
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(query: GetExpenseByIdQuery): Promise<ExpenseWithCategory> {
    const expense = await this.expenseRepository.findById(query.id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== query.userId) {
      throw new ForbiddenException('Access denied');
    }

    return toExpenseWithCategory(expense);
  }
}
