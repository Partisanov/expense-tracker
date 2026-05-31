import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpenseCommand } from './delete-expense.command';
import { ExpenseRepository } from '../expense.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@CommandHandler(DeleteExpenseCommand)
export class DeleteExpenseHandler
  implements ICommandHandler<DeleteExpenseCommand>
{
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(command: DeleteExpenseCommand): Promise<void> {
    const expense = await this.expenseRepository.findById(command.id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.expenseRepository.delete(command.id);
  }
}
