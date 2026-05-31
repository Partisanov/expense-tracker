import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { CreateUser } from '../auth/decorators/create-user.decorator';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesQueryDto } from './dto/get-expenses-query.dto';
import { CreateExpenseCommand } from './commands/create-expense.command';
import { UpdateExpenseCommand } from './commands/update-expense.command';
import { DeleteExpenseCommand } from './commands/delete-expense.command';
import { GetExpensesByUserQuery } from './queries/get-expenses-by-user.query';
import { GetExpenseByIdQuery } from './queries/get-expense-by-id.query';
import { GetExpenseStatsQuery } from './queries/get-expense-stats.query';
import { ExpenseWithCategory } from './expense-with-category';
import { PaginatedExpenses } from './queries/get-expenses-by-user.handler';
import { ExpenseStats } from './queries/get-expense-stats.handler';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @CreateUser() user: User,
    @Body() dto: CreateExpenseDto,
  ): Promise<ExpenseWithCategory> {
    return this.commandBus.execute<CreateExpenseCommand, ExpenseWithCategory>(
      new CreateExpenseCommand(
        dto.amount,
        dto.description,
        dto.date,
        dto.categoryId,
        user.id,
      ),
    );
  }

  @Get('stats')
  async getStats(@CreateUser() user: User): Promise<ExpenseStats> {
    return this.queryBus.execute<GetExpenseStatsQuery, ExpenseStats>(
      new GetExpenseStatsQuery(user.id),
    );
  }

  @Get()
  async findAll(
    @CreateUser() user: User,
    @Query() query: GetExpensesQueryDto,
  ): Promise<PaginatedExpenses> {
    return this.queryBus.execute<GetExpensesByUserQuery, PaginatedExpenses>(
      new GetExpensesByUserQuery(user.id, query.page, query.limit),
    );
  }

  @Get(':id')
  async findOne(
    @CreateUser() user: User,
    @Param('id') id: string,
  ): Promise<ExpenseWithCategory> {
    return this.queryBus.execute<GetExpenseByIdQuery, ExpenseWithCategory>(
      new GetExpenseByIdQuery(id, user.id),
    );
  }

  @Put(':id')
  async update(
    @CreateUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ): Promise<ExpenseWithCategory> {
    return this.commandBus.execute<UpdateExpenseCommand, ExpenseWithCategory>(
      new UpdateExpenseCommand(
        id,
        dto.amount,
        dto.description,
        dto.date,
        dto.categoryId,
        user.id,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CreateUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteExpenseCommand, void>(
      new DeleteExpenseCommand(id, user.id),
    );
  }
}
