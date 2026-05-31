import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { CategoryRepository } from '../category.repository';
import { Category } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    const category = await this.categoryRepository.findById(command.id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.categoryRepository.update(command.id, {
      name: command.name,
      color: command.color,
      icon: command.icon,
    });
  }
}
