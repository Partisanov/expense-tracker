# План реализации модуля Transactions

## 1. Prisma-схема — замена `Expense` на `Transaction`

**Файл:** `packages/prisma/schema.prisma`

- Удалить модель `Expense`
- Добавить модель `Transaction`:
  ```prisma
  model Transaction {
    id          String   @id @default(cuid())
    amount      Decimal  @db.Decimal(10, 2)
    type        String   // "income" | "expense"
    description String?
    date        DateTime @default(now())
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    userId      String
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    categoryId  String
    category    Category @relation(fields: [categoryId], references: [id])
    @@map("transactions")
  }
  ```
- Обновить связи: `User.expenses → User.transactions`, `Category.expenses → Category.transactions`
- Запустить `db:migrate` + `db:generate`

## 2. Модуль `transaction/` (по паттерну `category/`)

**Каталог:** `apps/backend/src/transaction/`

| Файл | Содержание |
|------|-----------|
| `dto/create-transaction.dto.ts` | `@IsNumber`, `@IsIn(['income','expense'])`, `@IsOptional` для description, `@IsDateString` для date, `@IsString` для categoryId |
| `dto/update-transaction.dto.ts` | Все поля optional |
| `transaction.repository.ts` | `create()`, `findByUserId()`, `findById()`, `findAggregatedByMonth()`, `update()`, `delete()` |
| `commands/create-transaction.command.ts` | amount, type, description, date, categoryId, userId |
| `commands/create-transaction.handler.ts` | Делегирует в repository |
| `commands/update-transaction.command.ts` | id + optional fields + userId |
| `commands/update-transaction.handler.ts` | Ownership check → repository.update() |
| `commands/delete-transaction.command.ts` | id, userId |
| `commands/delete-transaction.handler.ts` | Ownership check → repository.delete() |
| `queries/get-transactions-by-user.query.ts` | userId, month?, year? |
| `queries/get-transactions-by-user.handler.ts` | repository.findByUserId() с фильтрацией по month/year |
| `queries/get-transaction-by-id.query.ts` | id, userId |
| `queries/get-transaction-by-id.handler.ts` | Ownership check → возврат |
| `transaction.controller.ts` | `@Controller('transactions')`, `@UseGuards(JwtAuthGuard)`, inject `CommandBus`/`QueryBus`, `@CreateUser()` |
| `transaction.module.ts` | `CqrsModule`, controller, repository, все handlers |

## 3. Эндпоинты контроллера

| Метод | Путь | CQRS | Возвращает |
|-------|------|------|-----------|
| POST | `/transactions` | `CreateTransactionCommand` | `Transaction` |
| GET | `/transactions?month=&year=` | `GetTransactionsByUserQuery` | `Transaction[]` (с агрегацией по month/year) |
| GET | `/transactions/:id` | `GetTransactionByIdQuery` | `Transaction` |
| PATCH | `/transactions/:id` | `UpdateTransactionCommand` | `Transaction` |
| DELETE | `/transactions/:id` | `DeleteTransactionCommand` | `void` (204) |

## 4. Агрегация по month/year

В `TransactionRepository.findAggregatedByMonth()` — Prisma `groupBy` или `findMany` + фильтр `date` по диапазону месяца. Query-параметры `month` и `year` опциональны; если не переданы — возвращать все транзакции.

## 5. Регистрация в AppModule

Добавить `TransactionModule` в `imports` `AppModule`.

## 6. Проверка

```bash
npm -w packages/prisma run db:migrate
npm -w packages/prisma run db:generate
npm run build:backend
```

## Итого

~16 файлов для создания, 2 файла Prisma-схемы для обновления, 1 файл AppModule для изменения. Структура полностью следует паттерну `category/` + CQRS.
