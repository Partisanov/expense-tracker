import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryByIdQuery } from './get-category-by-id.query';
import { CategoryRepository } from '../category.repository';
import { Category } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler
  implements IQueryHandler<GetCategoryByIdQuery>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryByIdQuery): Promise<Category> {
    const category = await this.categoryRepository.findById(query.id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== query.userId) {
      throw new ForbiddenException('Access denied');
    }

    return category;
  }
}
