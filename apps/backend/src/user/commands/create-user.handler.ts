import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../user.repository';
import { User } from '@prisma/client';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    return this.userRepository.create({
      email: command.email,
      passwordHash: command.passwordHash,
      name: command.name,
    });
  }
}
