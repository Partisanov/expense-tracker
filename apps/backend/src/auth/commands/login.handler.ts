import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { GetUserByEmailQuery } from '../../user/queries/get-user-by-email.query';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AuthTokenPayload } from './register.handler';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand): Promise<AuthTokenPayload> {
    const user = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
      new GetUserByEmailQuery(command.email),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      command.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
