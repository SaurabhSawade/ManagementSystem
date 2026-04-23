# College Management Backend

Backend stack: Node.js, Express, TypeScript, Prisma, PostgreSQL.

## Features implemented

- Role-based access with proper relations: User, Role, Permission, UserRole, RolePermission.
- Super Admin seed script.
- Token security:
  - Access token verification
  - Token blacklisting table
  - Logout blacklists access token
  - Refresh token rotation endpoint blacklists old refresh token
- Admin can block and unblock users.
- User can view own profile.
- Forgot password and reset with OTP support for email/SMS channel.
- Super Admin import/export Excel support.
- Import updates DB using upsert/transaction-safe behavior per row handling.
- Standard API response shape:
  - status
  - success
  - message
  - data
  - type
- Winston logging with daily rotated files.

## Project structure

- src/router
- src/validation
- src/controller
- src/middleware
- src/constants
- src/utils
- src/service
- src/config
- src/app.ts
- src/server.ts

## Environment

Update .env:

- DATABASE_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN
- JWT_REFRESH_EXPIRES_IN
- OTP_EXPIRES_MINUTES
- OTP_MAX_ATTEMPTS

## Run

1. Install dependencies
- npm install

2. Generate Prisma client
- npm run prisma:generate

3. Run migration (requires valid PostgreSQL credentials)
- npm run prisma:migrate -- --name init

4. Seed roles, permissions, and super admin
- npm run prisma:seed

5. Start dev server
- npm run dev

## Docker

1. Build and start API + PostgreSQL
- npm run docker:up

2. Stop containers
- npm run docker:down

3. API URL
- http://localhost:4000

4. Swagger URL
- http://localhost:4000/docs

Docker startup command runs:
- Prisma client generate
- Prisma migrate deploy
- Node server start

Compose services:
- api (this backend)
- db (PostgreSQL 16)

## Default super admin (from seed)

- username: superadmin
- password: SuperAdmin@123

Change this password immediately after first login.

## API base

- /api/v1

## API docs

- Swagger UI: /docs
- OpenAPI file: docs/openapi.yaml
- Postman collection: docs/postman_collection.json

## Key endpoints

Auth:
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- POST /api/v1/auth/forgot-password/request-otp
- POST /api/v1/auth/forgot-password/verify-otp
- POST /api/v1/auth/reset-password

User management:
- POST /api/v1/users
- PATCH /api/v1/users/:userId/block
- PATCH /api/v1/users/:userId/unblock
- PATCH /api/v1/users/:userId/reset-password
- PATCH /api/v1/users/:userId/grant-admin
- PATCH /api/v1/users/:userId/revoke-admin

Profile:
- GET /api/v1/profile/me

Import/export:
- POST /api/v1/files/import (multipart/form-data, field name: file)
- GET /api/v1/files/export

## Excel sheet names for import

- Users
- Students
- Teachers
- Attendance
- Marks
- Results
- Books
- FeeRecords

## Notes

- Migration and seed require a running PostgreSQL instance and valid DATABASE_URL.
- Export endpoint returns Excel binary response.
- Import the Postman collection and set baseUrl, accessToken, refreshToken, and userId variables.
