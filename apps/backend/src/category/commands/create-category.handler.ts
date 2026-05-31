import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { CategoryRepository } from '../category.repository';
import { Category } from '@prisma/client';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    return this.categoryRepository.create({
      name: command.name,
      color: command.color,
      icon: command.icon,
      userId: command.userId,
    });
  }
}
