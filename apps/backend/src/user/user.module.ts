import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './user.repository';
import { CreateUserHandler } from './commands/create-user.handler';
import { GetUserByEmailHandler } from './queries/get-user-by-email.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id.handler';

const CommandHandlers = [CreateUserHandler];
const QueryHandlers = [GetUserByEmailHandler, GetUserByIdHandler];

@Module({
  imports: [CqrsModule],
  providers: [UserRepository, ...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
