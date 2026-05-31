import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../../user/queries/get-user-by-id.query';
import { User } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.queryBus.execute<GetUserByIdQuery, User | null>(
      new GetUserByIdQuery(payload.sub),
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
