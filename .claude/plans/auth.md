# План реализации авторизации через JWT с CQRS

## Чек-лист задач

- [x] Сохранить план в .claude/plans/auth.md
- [x] Обновить Prisma-схему (добавить passwordHash в User)
- [x] Установить зависимости (cqrs, jwt, passport, bcrypt, config, class-validator)
- [x] Создать PrismaModule/PrismaService
- [x] Создать UserModule с CQRS (commands + queries + repository)
- [x] Создать AuthModule с CQRS (controller, commands, strategies, guards, dto)
- [x] Обновить AppModule (подключить все модули)
- [x] Обновить .env.example и CLAUDE.md

---

## Детальный план

### 1. Обновить Prisma-схему
- Добавить поле `passwordHash String` в модель `User`
- Создать миграцию: `npm -w packages/prisma run db:migrate`

### 2. Установить зависимости в `apps/backend`
```bash
npm install @nestjs/cqrs @nestjs/jwt @nestjs/passport @nestjs/config passport passport-jwt bcrypt class-validator class-transformer @prisma/client
npm install -D @types/passport-jwt @types/bcrypt
```

### 3. Создать PrismaModule (глобальный)
```
apps/backend/src/prisma/
├── prisma.module.ts   # @Global() модуль
└── prisma.service.ts  # extends PrismaClient, implements OnModuleInit
```

### 4. Создать UserModule с CQRS
```
apps/backend/src/user/
├── user.module.ts
├── user.repository.ts
├── commands/
│   ├── create-user.command.ts
│   └── create-user.handler.ts
└── queries/
    ├── get-user-by-email.query.ts
    ├── get-user-by-email.handler.ts
    ├── get-user-by-id.query.ts
    └── get-user-by-id.handler.ts
```

- UserModule регистрирует все handlers через CqrsModule
- Никаких экспортируемых сервисов — только CQRS-шина

### 5. Создать AuthModule с CQRS
```
apps/backend/src/auth/
├── auth.module.ts
├── auth.controller.ts
├── commands/
│   ├── register.command.ts
│   ├── register.handler.ts
│   ├── login.command.ts
│   └── login.handler.ts
├── dto/
│   ├── register.dto.ts
│   └── login.dto.ts
├── strategies/
│   └── jwt.strategy.ts
└── guards/
    └── jwt-auth.guard.ts
```

**Эндпоинты:**
- `POST /api/auth/register` — регистрация (name, email, password)
- `POST /api/auth/login` — логин (email, password)

### 6. Архитектура взаимодействия через CQRS

```
AuthController
  → CommandBus.execute(RegisterCommand)
  → CommandBus.execute(LoginCommand)
      ↓
AuthModule handlers:
  RegisterHandler → QueryBus.execute(GetUserByEmailQuery)  → UserModule handler
                  → CommandBus.execute(CreateUserCommand)   → UserModule handler
                  → JwtService.sign()

  LoginHandler    → QueryBus.execute(GetUserByEmailQuery)  → UserModule handler
                  → bcrypt.compare()
                  → JwtService.sign()
```

**Ключевое правило:** AuthModule НЕ импортирует UserModule напрямую.
Взаимодействие только через CommandBus и QueryBus.

### 7. Обновить AppModule
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### 8. Обновить .env.example
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

---

## Переменные окружения

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `JWT_SECRET` | Секрет для подписи JWT | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | Время жизни токена | `7d` |

---

## Структура файлов после реализации

```
apps/backend/src/
├── app.module.ts          # обновлён
├── app.controller.ts
├── app.service.ts
├── main.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── user/
│   ├── user.module.ts
│   ├── user.repository.ts
│   ├── commands/
│   │   ├── create-user.command.ts
│   │   └── create-user.handler.ts
│   └── queries/
│       ├── get-user-by-email.query.ts
│       ├── get-user-by-email.handler.ts
│       ├── get-user-by-id.query.ts
│       └── get-user-by-id.handler.ts
└── auth/
    ├── auth.module.ts
    ├── auth.controller.ts
    ├── commands/
    │   ├── register.command.ts
    │   ├── register.handler.ts
    │   ├── login.command.ts
    │   └── login.handler.ts
    ├── dto/
    │   ├── register.dto.ts
    │   └── login.dto.ts
    ├── strategies/
    │   └── jwt.strategy.ts
    └── guards/
        └── jwt-auth.guard.ts
```
