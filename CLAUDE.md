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

Подробная документация: [`apps/backend/CLAUDE.md`](apps/backend/CLAUDE.md)

Nest.js 11 на порту **3001**. Глобальный префикс `/api`. Архитектура CQRS (CommandBus + QueryBus). Модули: Prisma (глобальный), User, Auth (JWT + Passport), Category, Expense.

## Фронтенд (`apps/frontend`)

Подробная документация: [`apps/frontend/CLAUDE.md`](apps/frontend/CLAUDE.md)

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui (@base-ui/react) на порту **3000**. Архитектура Feature Slice Design (FSD). Сторы на Zustand.

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
<important if="Нужно написать коммит">
## Соглашение о коммитах
Используй Conventional Commits:
- Тип: feat, fix, docs, refactor, test, ci
- Область (scope): модуль или область изменений
- Описание на русском, кратко
- Breaking changes помечай восклицательным знаком
</important>