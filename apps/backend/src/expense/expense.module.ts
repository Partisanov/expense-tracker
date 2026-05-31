import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';
import { CategoryRepository } from '../category/category.repository';
import { CreateExpenseHandler } from './commands/create-expense.handler';
import { UpdateExpenseHandler } from './commands/update-expense.handler';
import { DeleteExpenseHandler } from './commands/delete-expense.handler';
import { GetExpensesByUserHandler } from './queries/get-expenses-by-user.handler';
import { GetExpenseByIdHandler } from './queries/get-expense-by-id.handler';
import { GetExpenseStatsHandler } from './queries/get-expense-stats.handler';

const CommandHandlers = [
  CreateExpenseHandler,
  UpdateExpenseHandler,
  DeleteExpenseHandler,
];
const QueryHandlers = [
  GetExpensesByUserHandler,
  GetExpenseByIdHandler,
  GetExpenseStatsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ExpenseController],
  providers: [ExpenseRepository, CategoryRepository, ...CommandHandlers, ...QueryHandlers],
})
export class ExpenseModule {}
