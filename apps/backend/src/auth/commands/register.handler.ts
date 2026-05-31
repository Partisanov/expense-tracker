import { CommandHandler, ICommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { GetUserByEmailQuery } from '../../user/queries/get-user-by-email.query';
import { CreateUserCommand } from '../../user/commands/create-user.command';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export interface AuthTokenPayload {
  accessToken: string;
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthTokenPayload> {
    const existingUser = await this.queryBus.execute<
      GetUserByEmailQuery,
      User | null
    >(new GetUserByEmailQuery(command.email));

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    const user = await this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(command.email, passwordHash, command.name),
    );

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
