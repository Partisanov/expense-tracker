import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateExpenseCommand } from './create-expense.command';
import { ExpenseRepository } from '../expense.repository';
import { CategoryRepository } from '../../category/category.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ExpenseWithCategory, toExpenseWithCategory } from '../expense-with-category';

@CommandHandler(CreateExpenseCommand)
export class CreateExpenseHandler
  implements ICommandHandler<CreateExpenseCommand, ExpenseWithCategory>
{
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: CreateExpenseCommand): Promise<ExpenseWithCategory> {
    const category = await this.categoryRepository.findById(command.categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    const row = await this.expenseRepository.create({
      amount: command.amount,
      description: command.description,
      date: command.date ? new Date(command.date) : undefined,
      categoryId: command.categoryId,
      userId: command.userId,
    });

    return toExpenseWithCategory(row);
  }
}
