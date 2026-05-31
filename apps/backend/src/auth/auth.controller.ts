import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCommand } from './commands/register.command';
import { LoginCommand } from './commands/login.command';
import { AuthTokenPayload } from './commands/register.handler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { CreateUser } from './decorators/create-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthTokenPayload> {
    return this.commandBus.execute<RegisterCommand, AuthTokenPayload>(
      new RegisterCommand(dto.email, dto.password, dto.name),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthTokenPayload> {
    return this.commandBus.execute<LoginCommand, AuthTokenPayload>(
      new LoginCommand(dto.email, dto.password),
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CreateUser() user: User,
  ): Promise<{ id: string; email: string; name: string | null }> {
    return { id: user.id, email: user.email, name: user.name };
  }
}
