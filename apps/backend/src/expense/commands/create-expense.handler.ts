import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateExpenseCommand } from './create-expense.command';
import { ExpenseRepository } from '../expense.repository';
import { CategoryRepository } from '../../category/category.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

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

    return this.expenseRepository.create({
      amount: command.amount,
      description: command.description,
      date: command.date ? new Date(command.date) : undefined,
      categoryId: command.categoryId,
      userId: command.userId,
    });
  }
}
