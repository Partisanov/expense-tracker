import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExpenseCommand } from './update-expense.command';
import { ExpenseRepository } from '../expense.repository';
import { CategoryRepository } from '../../category/category.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ExpenseWithCategory, toExpenseWithCategory } from '../expense-with-category';

@CommandHandler(UpdateExpenseCommand)
export class UpdateExpenseHandler
  implements ICommandHandler<UpdateExpenseCommand, ExpenseWithCategory>
{
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: UpdateExpenseCommand): Promise<ExpenseWithCategory> {
    const expense = await this.expenseRepository.findById(command.id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    if (command.categoryId) {
      const category = await this.categoryRepository.findById(
        command.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      if (category.userId !== command.userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    const row = await this.expenseRepository.update(command.id, {
      amount: command.amount,
      description: command.description,
      date: command.date ? new Date(command.date) : undefined,
      categoryId: command.categoryId,
    });

    return toExpenseWithCategory(row);
  }
}
