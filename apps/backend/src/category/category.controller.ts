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
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { CreateUser } from '../auth/decorators/create-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryCommand } from './commands/create-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { GetCategoriesByUserQuery } from './queries/get-categories-by-user.query';
import { GetCategoryByIdQuery } from './queries/get-category-by-id.query';
import { Category } from '@prisma/client';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @CreateUser() user: User,
    @Body() dto: CreateCategoryDto,
  ): Promise<Category> {
    return this.commandBus.execute<CreateCategoryCommand, Category>(
      new CreateCategoryCommand(dto.name, dto.color, dto.icon, user.id),
    );
  }

  @Get()
  async findAll(@CreateUser() user: User): Promise<Category[]> {
    return this.queryBus.execute<GetCategoriesByUserQuery, Category[]>(
      new GetCategoriesByUserQuery(user.id),
    );
  }

  @Get(':id')
  async findOne(
    @CreateUser() user: User,
    @Param('id') id: string,
  ): Promise<Category> {
    return this.queryBus.execute<GetCategoryByIdQuery, Category>(
      new GetCategoryByIdQuery(id, user.id),
    );
  }

  @Put(':id')
  async update(
    @CreateUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.commandBus.execute<UpdateCategoryCommand, Category>(
      new UpdateCategoryCommand(id, dto.name, dto.color, dto.icon, user.id),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CreateUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteCategoryCommand, Category>(
      new DeleteCategoryCommand(id, user.id),
    );
  }
}
