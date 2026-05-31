# Expense Tracker — Обзор проекта

## Структура монорепозитория

```
expence-tracker/
├── apps/
│   ├── frontend/        # Next.js 16 (порт 3000)
│   └── backend/         # Nest.js 11 (порт 3001)
└── packages/
    └── prisma/          # Prisma schema + seed
```

Монорепо управляется через **npm workspaces**.

## Стек технологий

| Слой | Технология |
|------|-----------|
| Монорепо | npm workspaces |
| Фронтенд | Next.js 16 (App Router, TypeScript, Tailwind CSS v4, shadcn/ui) |
| Бэкенд | Nest.js 11 (TypeScript) |
| БД | PostgreSQL 16 |
| ORM | Prisma 6 |
| Линтинг | ESLint + Prettier |
| Инфраструктура | Docker Compose |

## База данных (`packages/prisma`)

Prisma 6 + PostgreSQL 16. Схема содержит 3 модели:

- **User** — пользователи (`id`, `email`, `name`, `passwordHash`, `createdAt`, `updatedAt`)
- **Category** — категории расходов (`id`, `name`, `color`, `icon`, `createdAt`, `updatedAt`)
- **Expense** — расходы (`id`, `amount`, `description`, `date`, `createdAt`, `updatedAt`, `userId`, `categoryId`)

Seed-файл создаёт 5 категорий: Food & Drinks, Transport, Shopping, Entertainment, Health.

### Скрипты Prisma

```bash
npm -w packages/prisma run db:migrate       # Применить миграции (dev)
npm -w packages/prisma run db:migrate:deploy # Применить миграции (prod)
npm -w packages/prisma run db:generate      # Сгенерировать Prisma Client
npm -w packages/prisma run db:push          # Синхронизировать схему без миграций
npm -w packages/prisma run db:studio        # Открыть Prisma Studio
npm -w packages/prisma run db:seed          # Заполнить БД начальными данными
```

## Бэкенд (`apps/backend`)

Nest.js 11 на порту **3001**. Глобальный префикс `/api`.

### Реализованные эндпоинты

- `GET /api/health` → `{ status: "ok" }`
- `POST /api/auth/register` → регистрация, возвращает `{ accessToken }`
- `POST /api/auth/login` → вход, возвращает `{ accessToken }`
- `POST /api/categories` → создать категорию (JWT)
- `GET /api/categories` → список категорий пользователя (JWT)
- `GET /api/categories/:id` → категория по ID (JWT, ownership)
- `PUT /api/categories/:id` → обновить категорию (JWT, ownership)
- `DELETE /api/categories/:id` → удалить категорию (JWT, ownership)

### Архитектура

- **PrismaModule** — глобальный модуль, предоставляет `PrismaService`
- **UserModule** — модуль пользователей, взаимодействие только через CQRS
  - Commands: `CreateUserCommand`
  - Queries: `GetUserByEmailQuery`, `GetUserByIdQuery`
- **AuthModule** — модуль авторизации через JWT + Passport
  - Commands: `RegisterCommand`, `LoginCommand`
  - Стратегия: `JwtStrategy` (Bearer token)
  - Guard: `JwtAuthGuard` — для защиты маршрутов

- **CategoryModule** — модуль категорий, взаимодействие через CQRS
  - Commands: `CreateCategoryCommand`, `UpdateCategoryCommand`, `DeleteCategoryCommand`
  - Queries: `GetCategoriesByUserQuery`, `GetCategoryByIdQuery`
  - Все эндпоинты защищены `JwtAuthGuard`, проверка ownership в хендлерах

Модули взаимодействуют **только через CQRS-шины** (`CommandBus`, `QueryBus`), без прямых импортов сервисов.

### Переменные окружения

| Переменная | Описание |
|-----------|----------|
| `JWT_SECRET` | Секрет для подписи JWT |
| `JWT_EXPIRES_IN` | Время жизни токена (по умолчанию `7d`) |

### Что не реализовано

- API эндпоинты для расходов

### Скрипты бэкенда

```bash
npm run dev:backend    # Запуск в dev-режиме (watch)
npm run build:backend  # Сборка
```

## Фронтенд (`apps/frontend`)

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui на порту **3000**.

### Архитектура — Feature Slice Design (FSD)

```
src/
├── app/                    # Роутинг Next.js (App Router)
│   ├── (auth)/             # Route group: auth-страницы
│   │   ├── login/          # /login
│   │   └── register/       # /register
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # /
├── features/               # Фичи (бизнес-логика по доменам)
│   └── auth/
│       ├── api/            # API-вызовы (login, register)
│       ├── model/          # Стор (Zustand), типы состояния
│       ├── ui/             # React-компоненты фичи (формы)
│       └── index.ts        # Публичный API фичи
├── shared/                 # Общий код
│   ├── api/                # HTTP-клиент (apiFetch, ApiError)
│   └── lib/                # Утилиты (auth token helpers)
├── components/             # shadcn/ui компоненты
│   └── ui/
└── lib/                    # Общие утилиты (cn)
```

**Правила FSD:**
- Слайцы: `features` → `shared`. Импорт только внутрь по слоям.
- Каждая фича экспортирует публичный API через `index.ts`.
- Страницы (`app/`) импортируют только из `features/` и `shared/`.
- `shared/` не импортирует `features/`.

### Реализованные страницы

- `/` — главная страница с навигацией
- `/login` — форма входа
- `/register` — форма регистрации

### Что не реализовано

- Список расходов
- Формы добавления/редактирования расходов
- Дашборд / аналитика

### Скрипты фронтенда

```bash
npm run dev:frontend    # Запуск в dev-режиме (Turbopack)
npm run build:frontend  # Сборка
```

## Инфраструктура

Docker Compose поднимает PostgreSQL 16 (`expence-tracker-db`).

```bash
docker compose up -d   # Запустить PostgreSQL
```

Переменные окружения задаются через `.env` (скопировать из `.env.example`):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=expence_tracker
POSTGRES_PORT=5432
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expence_tracker?schema=public"
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Быстрый старт

```bash
cp .env.example .env
docker compose up -d
npm install
npm -w packages/prisma run db:migrate
npm -w packages/prisma run db:generate
npm -w packages/prisma run db:seed
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:3001
```

## Общие скрипты

```bash
npm run lint     # Линтинг всего проекта
npm run format   # Форматирование кода (Prettier)
```
## Соглашение о коммитах
Используй Conventional Commits:
- Тип: feat, fix, docs, refactor, test, ci
- Область (scope): модуль или область изменений
- Описание на русском, кратко
- Breaking changes помечай восклицательным знаком