import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryRepository } from '../category.repository';
import { Category } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: DeleteCategoryCommand): Promise<Category> {
    const category = await this.categoryRepository.findById(command.id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.categoryRepository.delete(command.id);
  }
}
