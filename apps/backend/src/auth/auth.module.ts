import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RegisterHandler } from './commands/register.handler';
import { LoginHandler } from './commands/login.handler';
import { JwtStrategy } from './strategies/jwt.strategy';

const CommandHandlers = [RegisterHandler, LoginHandler];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          secret: configService.get<string>('JWT_SECRET', 'secret'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
          },
        }) as JwtModuleOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, JwtStrategy],
})
export class AuthModule {}
