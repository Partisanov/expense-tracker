import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CreateCategoryHandler } from './commands/create-category.handler';
import { UpdateCategoryHandler } from './commands/update-category.handler';
import { DeleteCategoryHandler } from './commands/delete-category.handler';
import { GetCategoriesByUserHandler } from './queries/get-categories-by-user.handler';
import { GetCategoryByIdHandler } from './queries/get-category-by-id.handler';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];
const QueryHandlers = [
  GetCategoriesByUserHandler,
  GetCategoryByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CategoryController],
  providers: [CategoryRepository, ...CommandHandlers, ...QueryHandlers],
})
export class CategoryModule {}
