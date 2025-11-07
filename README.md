# api-motorista

Backend API for the school transport platform (driver app).
Stack: NestJS + Prisma + PostgreSQL + JWT auth.

## 1. Requirements
- Node.js 20+
- npm
- Docker Desktop (for local Postgres)

## 2. Environment
Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/motorista"
JWT_SECRET="super_secret_jwt_key_change_me"
PORT=3000
