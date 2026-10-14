## API backend (Express + PostgreSQL + JWT)

1. Создайте БД PostgreSQL.
2. Выполните `psql "$DATABASE_URL" -f server/schema.sql`.
3. Скопируйте `.env.example` в `.env`, заполните `DATABASE_URL` и длинный случайный `JWT_SECRET`.
4. `npm install`, затем `npm run server`.

Маршруты: `/api/health`, регистрация/вход, словарь/транскрипция, CRUD макетов, история заказов (чтение).
