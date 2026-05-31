# Expense Tracker — Бэкенд

Nest.js 11 на порту **3001**. Глобальный префикс `/api`.

## Архитектура

Модули взаимодействуют **только через CQRS-шины** (`CommandBus`, `QueryBus`), без прямых импортов сервисов между модулями.

### Структура модулей

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── prisma/                    # Глобальный PrismaModule
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── user/                      # Модуль пользователей
│   ├── user.module.ts
│   ├── commands/
│   │   └── create-user.command.ts + handler
│   └── queries/
│       ├── get-user-by-email.query.ts + handler
│       └── get-user-by-id.query.ts + handler
├── auth/                      # Модуль авторизации
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── dto/ (register.dto, login.dto)
│   ├── commands/ (register, login)
│   ├── strategies/ (jwt.strategy)
│   ├── guards/ (jwt-auth.guard)
│   └── decorators/ (create-user.decorator)
├── category/                  # Модуль категорий
│   ├── category.module.ts
│   ├── category.controller.ts
│   ├── category.repository.ts
│   ├── dto/ (create, update)
│   ├── commands/ (create, update, delete)
│   └── queries/ (get-by-user, get-by-id)
└── expense/                   # Модуль расходов
    ├── expense.module.ts
    ├── expense.controller.ts
    ├── expense.repository.ts
    ├── expense-with-category.ts   # Тип + конвертер Decimal→number
    ├── dto/ (create, update, get-expenses-query)
    ├── commands/ (create, update, delete)
    └── queries/ (get-by-user, get-by-id, get-stats)
```

### Модули

- **PrismaModule** — глобальный модуль, предоставляет `PrismaService`
- **UserModule** — пользователи (CQRS)
  - Commands: `CreateUserCommand`
  - Queries: `GetUserByEmailQuery`, `GetUserByIdQuery`
- **AuthModule** — авторизация через JWT + Passport
  - Commands: `RegisterCommand`, `LoginCommand`
  - Стратегия: `JwtStrategy` (Bearer token)
  - Guard: `JwtAuthGuard` — для защиты маршрутов
  - Decorator: `@CreateUser()` — извлекает пользователя из запроса
- **CategoryModule** — категории расходов (CQRS)
  - Commands: `CreateCategoryCommand`, `UpdateCategoryCommand`, `DeleteCategoryCommand`
  - Queries: `GetCategoriesByUserQuery`, `GetCategoryByIdQuery`
  - Все эндпоинты защищены `JwtAuthGuard`, проверка ownership в хендлерах
- **ExpenseModule** — расходы (CQRS)
  - Commands: `CreateExpenseCommand`, `UpdateExpenseCommand`, `DeleteExpenseCommand`
  - Queries: `GetExpensesByUserQuery`, `GetExpenseByIdQuery`, `GetExpenseStatsQuery`
  - Все эндпоинты защищены `JwtAuthGuard`, проверка ownership в хендлерах
  - Импортирует `CategoryRepository` напрямую (не через CategoryModule) для валидации ownership категории

### Важные детали

- **ExpenseWithCategory** — интерфейс и конвертер `toExpenseWithCategory()` вынесены в `expense-with-category.ts`. Prisma возвращает `Decimal` для `amount`, конвертер приводит к `number`.
- **ExpenseRepository** — методы `getMonthTotal`, `getTodayTotal`, `getTopCategory` используют UTC-даты (`startOfDayUTC()`, `startOfMonthUTC()`), а не серверное локальное время.
- **Delete** расходы — возвращает `204 No Content` (void), а не удалённую сущность.

## Реализованные эндпоинты

### Health
- `GET /api/health` → `{ status: "ok" }`

### Auth
- `POST /api/auth/register` → регистрация, возвращает `{ accessToken }`
- `POST /api/auth/login` → вход, возвращает `{ accessToken }`
- `GET /api/auth/profile` → профиль текущего пользователя (JWT)

### Categories (JWT)
- `POST /api/categories` → создать категорию
- `GET /api/categories` → список категорий пользователя
- `GET /api/categories/:id` → категория по ID (ownership)
- `PUT /api/categories/:id` → обновить категорию (ownership)
- `DELETE /api/categories/:id` → удалить категорию (ownership)

### Expenses (JWT)
- `POST /api/expenses` → создать расход
- `GET /api/expenses` → список расходов (пагинация: `?page=1&limit=10`)
- `GET /api/expenses/stats` → статистика (monthTotal, todayTotal, topCategory)
- `GET /api/expenses/:id` → расход по ID (ownership)
- `PUT /api/expenses/:id` → обновить расход (ownership)
- `DELETE /api/expenses/:id` → удалить расход (ownership, 204)

## Переменные окружения

| Переменная | Описание |
|-----------|----------|
| `DATABASE_URL` | URL подключения к PostgreSQL |
| `JWT_SECRET` | Секрет для подписи JWT |
| `JWT_EXPIRES_IN` | Время жизни токена (по умолчанию `7d`) |
| `PORT` | Порт сервера (по умолчанию `3001`) |

## Скрипты

```bash
npm run dev:backend    # Запуск в dev-режиме (watch)
npm run build:backend  # Сборка
```

## Что не реализовано

- Валидация ownership категории при удалении (расходы с этой категорией теряют ссылку)
- Обновление статистики (stats) на фронте после создания/удаления расхода
- Refresh token (только access token)
