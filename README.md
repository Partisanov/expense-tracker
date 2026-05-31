# Expense Tracker

Монорепозиторий для трекера расходов на основе Next.js + Nest.js + Prisma + PostgreSQL.

## Стек

| Слой | Технология |
|------|-----------|
| Монорепо | npm workspaces |
| Фронтенд | Next.js 16 (App Router, TypeScript, Tailwind CSS v4) |
| Бэкенд | Nest.js 11 (TypeScript) |
| БД | PostgreSQL 16 |
| ORM | Prisma 6 |
| Линтинг | ESLint + Prettier |
| Инфраструктура | Docker Compose |

## Структура проекта

```
expence-tracker/
├── apps/
│   ├── frontend/        # Next.js 16 (порт 3000)
│   └── backend/         # Nest.js (порт 3001)
└── packages/
    └── prisma/          # Prisma schema + seed
```

## Быстрый старт

### 1. Клонировать и настроить окружение

```bash
cp .env.example .env
```

### 2. Запустить PostgreSQL через Docker

```bash
docker compose up -d
```

### 3. Установить зависимости

```bash
npm install
```

### 4. Применить миграции и сгенерировать Prisma Client

```bash
npm -w packages/prisma run db:migrate
npm -w packages/prisma run db:generate
```

### 5. Заполнить БД начальными данными

```bash
npm -w packages/prisma run db:seed
```

### 6. Запустить приложения

```bash
# Фронтенд (http://localhost:3000)
npm run dev:frontend

# Бэкенд (http://localhost:3001)
npm run dev:backend
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev:frontend` | Запуск фронтенда в dev-режиме |
| `npm run dev:backend` | Запуск бэкенда в dev-режиме |
| `npm run build:frontend` | Сборка фронтенда |
| `npm run build:backend` | Сборка бэкенда |
| `npm run lint` | Линтинг всего проекта |
| `npm run format` | Форматирование кода |

## API

Бэкенд доступен по адресу `http://localhost:3001/api`

- `GET /api/health` — проверка состояния сервера
