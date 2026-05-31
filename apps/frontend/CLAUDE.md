# Expense Tracker — Фронтенд

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui на порту **3000**.

## Архитектура — Feature Slice Design (FSD)

```
src/
├── app/                         # Роутинг Next.js (App Router)
│   ├── (auth)/                  # Route group: auth-страницы (без сайдбара)
│   │   ├── login/               # /login
│   │   └── register/            # /register
│   ├── (dashboard)/             # Route group: защищённые страницы (с сайдбаром)
│   │   ├── layout.tsx           # Auth guard + профиль + сайдбар
│   │   ├── page.tsx             # / — дашборд
│   │   ├── expenses/            # /expenses — список расходов
│   │   └── categories/          # /categories — управление категориями
│   ├── auth-hydrator.tsx        # Восстановление токена из localStorage
│   ├── error.tsx                # Глобальный error boundary
│   ├── not-found.tsx            # 404 страница
│   ├── globals.css
│   └── layout.tsx               # Корневой layout
├── features/                    # Фичи (бизнес-логика по доменам)
│   ├── auth/
│   │   ├── api/                 # API-вызовы (login, register, profile) + типы
│   │   ├── model/               # Zustand-стор (token, user, setUser)
│   │   ├── ui/                  # LoginForm, RegisterForm
│   │   └── index.ts             # Публичный API фичи
│   ├── category/
│   │   ├── api/                 # CRUD API-вызовы + типы
│   │   ├── model/               # Zustand-стор (categories, loading)
│   │   ├── ui/                  # CategoryList, CreateCategoryDialog,
│   │   │                        # EditCategoryDialog, DeleteCategoryDialog
│   │   └── index.ts
│   └── expense/
│       ├── api/                 # CRUD + stats API-вызовы + типы
│       ├── model/               # Zustand-стор (expenses, pagination, stats, loading)
│       ├── ui/                  # ExpenseCard, ExpenseList, ExpenseSummary,
│       │                        # CreateExpenseDialog, EditExpenseDialog,
│       │                        # DeleteExpenseDialog
│       └── index.ts
├── widgets/                     # Виджеты (композитные компоненты)
│   └── ui/
│       └── app-sidebar.tsx      # Боковая навигация (импортирует features/auth)
├── shared/                      # Общий код
│   ├── api/                     # HTTP-клиент (apiFetch, ApiError)
│   │   └── client.ts           # apiFetch<T> — авто-подстановка Bearer, обработка 204
│   └── lib/                     # Утилиты
│       ├── auth.ts              # getToken, setToken, removeToken
│       ├── category-icon.ts     # getCategoryIcon — маппинг icon→emoji
│       ├── config.ts            # CURRENCY_SYMBOL, formatAmount
│       └── index.ts             # Barrel
├── components/                  # shadcn/ui компоненты (@base-ui/react)
│   └── ui/                      # Button, Input, Dialog, Select, Sheet, etc.
└── lib/                         # cn (tailwind-merge)
```

### Правила FSD

- Слои: `app` → `widgets` → `features` → `shared`. Импорт только внутрь по слоям.
- Каждая фича экспортирует публичный API через `index.ts`.
- Страницы (`app/`) импортируют из `features/`, `widgets/` и `shared/`.
- `widgets/` может импортировать `features/` (сайдбар импортирует auth).
- `shared/` **не** импортирует `features/` или `widgets/`.
- Между фичами — импорт только через barrel (`@/features/category`), не глубокий (`@/features/category/api`).

### Страницы

| Роут | Файл | Описание |
|------|------|----------|
| `/` | `(dashboard)/page.tsx` | Дашборд — ExpenseSummary + ExpenseList + CreateExpenseDialog |
| `/login` | `(auth)/login/page.tsx` | Форма входа |
| `/register` | `(auth)/register/page.tsx` | Форма регистрации |
| `/expenses` | `(dashboard)/expenses/page.tsx` | Полный список расходов |
| `/categories` | `(dashboard)/categories/page.tsx` | Управление категориями (CRUD) |

### Dashboard Layout

`(dashboard)/layout.tsx` — при маунте проверяет наличие `token` в сторе. Если `token` есть, но `user` не загружен — вызывает `getProfile()`. При ошибке — редирект на `/login`. Рендерит `AppSidebar` + основной контент.

## Важные детали

### shadcn/ui + base-ui

Компоненты shadcn используют **`@base-ui/react`** (не Radix). Ключевые отличия:

- **НЕТ** пропа `asChild`. Вместо него — `render` prop:
  ```tsx
  <DialogTrigger render={<Button />}>...</DialogTrigger>
  <SheetTrigger render={<Button />}>...</SheetTrigger>
  ```
- **Select** — `onValueChange` получает `(value: string | null, eventDetails)`. Нужен null guard:
  ```tsx
  <Select value={val} onValueChange={(v) => v && setVal(v)}>
  ```

### API-клиент

`shared/api/client.ts`:
- `apiFetch<T>(url, options)` — автоматически подставляет `Bearer` токен из localStorage
- Возвращает `T` (JSON), обрабатывает `204 No Content` (возвращает `undefined`)
- Бросает `ApiError` с `status` и `message`

### Сторы (Zustand)

Каждая фича имеет свой Zustand-стор:
- **auth-store**: `token`, `user`, `setToken`, `setUser`, `hydrate`
- **category-store**: `categories`, `loading`, `setCategories`, `setLoading`
- **expense-store**: `expenses`, `pagination`, `stats`, `loading`, `setExpenses`, `setStats`, `setLoading`

### Общие утилиты (shared/lib)

- `getCategoryIcon(icon, name)` — маппит строковый ключ иконки (или имя категории) в emoji
- `CURRENCY_SYMBOL` = `"₽"` — символ валюты (не хардкодить в компонентах)
- `formatAmount(n)` — форматирует число с двумя знаками после запятой
- `getToken/setToken/removeToken` — работа с токеном в localStorage

### Optimistic updates

- `CreateExpenseDialog` — добавляет новый расход в начало списка (обрезает до лимита пагинации)
- `EditExpenseDialog` — заменяет расход в списке на обновлённый
- `DeleteExpenseDialog` — удаляет расход из списка, пересчитывает total/totalPages
- `CreateCategoryDialog` — добавляет категорию в конец списка
- `EditCategoryDialog` — заменяет категорию в списке
- `DeleteCategoryDialog` — удаляет категорию из списка

## Переменные окружения

| Переменная | Описание |
|-----------|----------|
| `NEXT_PUBLIC_API_URL` | URL бэкенд-API (например, `http://localhost:3001/api`) |

## Скрипты

```bash
npm run dev:frontend    # Запуск в dev-режиме (Turbopack)
npm run build:frontend  # Сборка
```

## Что не реализовано

- Обновление ExpenseSummary (stats) после создания/редактирования/удаления расхода
- Дашборд / аналитика с графиками
- Фильтрация расходов по категории/дате
- Редактирование профиля пользователя
- Refresh token
