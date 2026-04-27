# College Management System Backend

**Production-Grade Backend** with Node.js, Express, TypeScript, Prisma, PostgreSQL, and RBAC

## 🎯 Complete Feature Implementation

### ✅ Core Features Implemented
- **Role-Based Access Control (RBAC)** with comprehensive permission matrix
- **Authentication** - JWT with access/refresh token rotation
- **Token Management** - Blacklisting, secure logout
- **Password Management** - Forgot password with OTP (Email/SMS)
- **User Management** - Create, block/unblock, role assignment
- **Audit Logging** - Track all operations with actor/target
- **Winston Logging** - Daily rotated files with structured logging
- **Error Handling** - Standardized error responses with proper HTTP status codes
- **API Documentation** - Swagger/OpenAPI with full route documentation

### 🎓 Academic Management
- **Students** - CRUD operations, classroom assignment, roll number tracking
- **Teachers** - CRUD operations, department assignment, employee ID tracking
- **Classrooms** - CRUD operations, section management, student count tracking
- **Subjects** - CRUD operations, code-based identification
- **Attendance** - Mark/bulk mark, statistics, date range queries
- **Marks** - Create/update/bulk operations, subject & exam-wise tracking
- **Exams** - CRUD operations, term-based organization, date scheduling
- **Results** - Auto-calculation with grading (A-F), percentage calculation

### 💰 Administrative
- **Fee Management** - Create, update, mark as paid, status tracking, statistics
- **Library System** - Book management, issue/return tracking, fine calculation
- **Audit Logs** - Complete history of all operations with filtering

### 📊 Data Operations
- **Import/Export** - Excel support for bulk operations
- **Pagination** - All list endpoints with configurable page/limit
- **Filtering** - Search, date range, status-based filtering
- **Sorting** - Configurable sort by with ascending/descending order
- **Bulk Operations** - Attendance, marks bulk entry support

## 🗂️ Project Structure

```
src/
├── controller/        # Request handlers for all endpoints
├── service/          # Business logic layer
├── model/            # Data models (being phased out)
├── router/           # Route definitions with RBAC
│   └── v1/          # API v1 routes
├── middleware/       # Auth, RBAC, validation, error handling
├── validation/       # Zod schemas for all endpoints
├── config/          # Environment, logger, database setup
├── constants/       # Permissions, roles, HTTP status codes
├── utils/           # Helper functions, JWT, password, pagination
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 📚 Complete API Routes

### Authentication (`/api/v1/auth`)
- `POST /login` - User login with credentials
- `POST /refresh` - Refresh access token
- `POST /forgot-password/request-otp` - Request OTP for password reset
- `POST /forgot-password/verify-otp` - Verify OTP and reset password
- `POST /logout` - Logout and blacklist token
- `POST /reset-password` - Change password (authenticated users)

### User Management (`/api/v1/users`)
- `POST /` - Create new user (ADMIN only)
- `PATCH /:userId/block-status` - Set or toggle user block status using one endpoint
- `PATCH /:userId/block` - Block user
- `PATCH /:userId/unblock` - Unblock user
- `PATCH /:userId/reset-password` - Admin reset password
- `PATCH /:userId/grant-admin` - Grant admin role
- `PATCH /:userId/revoke-admin` - Revoke admin role

### Role-Based Route Namespaces
- `GET /api/v1/admin/...` - Admin-oriented route grouping for management modules
- `GET /api/v1/student/...` - Student-oriented route grouping for self-service modules
- `GET /api/v1/teacher/...` - Teacher-oriented route grouping for teaching modules
- `GET /api/v1/accountant/...` - Accountant-oriented route grouping for fee and reporting modules
- `GET /api/v1/library/...` - Library-oriented route grouping for library operations
- These are aliases for existing v1 routes and still enforce the same RBAC permissions

### Student Management (`/api/v1/students`)
- `POST /` - Create student
- `GET /` - List students with pagination & filtering
- `GET /:studentId` - Get student details
- `PATCH /:studentId` - Update student info
- `DELETE /:studentId` - Delete student

### Teacher Management (`/api/v1/teachers`)
- `POST /` - Create teacher
- `GET /` - List teachers with pagination & filtering
- `GET /:teacherId` - Get teacher details
- `PATCH /:teacherId` - Update teacher info
- `DELETE /:teacherId` - Delete teacher

### Classroom Management (`/api/v1/classrooms`)
- `POST /` - Create classroom
- `GET /` - List classrooms with pagination & filtering
- `GET /:classroomId` - Get classroom details & student count
- `PATCH /:classroomId` - Update classroom info
- `DELETE /:classroomId` - Delete classroom

### Subject Management (`/api/v1/subjects`)
- `POST /` - Create subject
- `GET /` - List subjects with pagination & filtering
- `GET /:subjectId` - Get subject details
- `PATCH /:subjectId` - Update subject
- `DELETE /:subjectId` - Delete subject

### Attendance Management (`/api/v1/attendance`)
- `POST /` - Mark attendance for single student
- `POST /bulk` - Mark attendance for multiple students
- `GET /` - List attendance with filtering & pagination
- `GET /:attendanceId` - Get specific attendance record
- `PATCH /:attendanceId` - Update attendance record
- `GET /stats/:studentId` - Get student attendance statistics

### Marks Management (`/api/v1/marks`)
- `POST /` - Create mark for student
- `POST /bulk` - Bulk create marks for exam
- `GET /` - List marks with filtering & pagination
- `GET /:markId` - Get specific mark
- `PATCH /:markId` - Update mark
- `GET /student/:studentId` - Get all marks for student

### Exam Management (`/api/v1/exams`)
- `POST /` - Create exam
- `GET /` - List exams with pagination & filtering
- `GET /:examId` - Get exam details
- `PATCH /:examId` - Update exam
- `DELETE /:examId` - Delete exam

### Results Management (`/api/v1/results`)
- `GET /` - List results with filtering & pagination
- `GET /:resultId` - Get specific result
- `POST /generate` - Auto-generate result from marks
- `GET /student/:studentId` - Get all results for student

### Fee Management (`/api/v1/fees`)
- `POST /` - Create fee record
- `GET /` - List fees with pagination & filtering
- `GET /:feeId` - Get fee details
- `PATCH /:feeId` - Update fee record
- `POST /:feeId/mark-paid` - Mark fee as paid
- `GET /stats/:userId` - Get user fee statistics

### Library Management (`/api/v1/books`)
- `POST /` - Create book
- `GET /` - List books with pagination & filtering
- `GET /:bookId` - Get book details
- `PATCH /:bookId` - Update book
- `POST /issue` - Issue book to user
- `POST /:bookIssueId/return` - Return book
- `GET /issues/list` - List all book issues
- `GET /issues/:bookIssueId` - Get specific book issue

### Audit Logs (`/api/v1/audit`)
- `GET /` - List audit logs with filtering & pagination
- `GET /:auditId` - Get specific audit log

### Profile (`/api/v1/profile`)
- `GET /me` - Get current user profile

### Data Operations (`/api/v1/files`)
- `POST /import` - Import data from Excel
- `GET /export` - Export data to Excel

## 🔐 Role-Based Permissions Matrix

### Super Admin
- All permissions across all modules

### Admin
- User management (create, read, update, block/unblock)
- Student management (create, read, update, list)
- Teacher management (create, read, update, list)
- Classroom management (create, read, update, list)
- Subject management (create, read, update, list)
- Attendance management (create, read, update, list)
- Marks management (create, read, update)
- Exam management (create, read, update, list)
- Results management (read)
- Fee management (create, read, update)
- Book management (create, read, update, list, issue, return)
- Audit logs (read)
- Data import/export

### Teacher
- Profile viewing (self)
- Student reading & listing
- Classroom reading & listing
- Attendance management (mark, read, list)
- Marks management (create, read, update)
- Exam reading & listing
- Results reading

### Student
- Profile viewing (self)
- Attendance reading (self)
- Marks reading (self)
- Results reading (self)
- Fee reading (self)
- Book reading & issue/return

### Accountant
- Profile viewing (self)
- Student reading & listing
- Fee management (create, read, update)
- Data export

### Library Staff
- Profile viewing (self)
- Book management (full CRUD)
- Book issue/return operations

## 🔒 Authentication & Security

### Token Security
- **Access Token**: Short-lived (15 min default), used for API calls
- **Refresh Token**: Long-lived (7 days default), used to obtain new access tokens
- **Token Rotation**: Old refresh tokens are blacklisted on refresh
- **Logout**: Blacklists all tokens to prevent reuse

### Password Security
- Bcrypt hashing with salt rounds (10)
- OTP verification for password reset (configurable expiry: 15 min default)
- Password change audit logging
- Support for Email/SMS OTP channels

### Rate Limiting
- Auth endpoints: 5 attempts per 15 minutes
- OTP endpoints: 5 attempts per 15 minutes
- General endpoints: Standard rate limits

## 📝 Validation & Error Handling

### Input Validation
- Zod schema validation on all endpoints
- Type-safe request/response handling
- Automatic validation error responses

### Error Responses
```json
{
  "status": 400,
  "success": false,
  "message": "Validation failed",
  "type": "VALIDATION_ERROR"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 🚀 Setup & Running

### Prerequisites
- Node.js 18+ & npm
- PostgreSQL 13+
- Redis (optional, for future caching)

### Installation
```bash
npm install
```

### Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate -- --name init

# Seed database with roles, permissions, and sample users
npm run prisma:seed
```

### Environment Configuration
Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/college_db

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OTP
OTP_EXPIRES_MINUTES=15
OTP_MAX_ATTEMPTS=5

# Server
PORT=4000
NODE_ENV=development

# Logging
LOG_LEVEL=info
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🐳 Docker Setup

### Build & Run with Docker
```bash
npm run docker:up
```

### Stop Containers
```bash
npm run docker:down
```

### API URL
- Local: `http://localhost:4000`
- Swagger Docs: `http://localhost:4000/api-docs`
- Health Check: `http://localhost:4000/health`

## 📊 Database Schema

### Core Tables
- `User` - User accounts with roles
- `Role` - Role definitions
- `Permission` - Permission definitions
- `UserRole` - User-role associations
- `RolePermission` - Role-permission associations
- `TokenBlacklist` - Blacklisted JWT tokens
- `OtpVerification` - OTP records
- `PasswordResetRequest` - Password reset tracking
- `AuditLog` - Audit trail

### Academic Tables
- `StudentProfile` - Student information
- `TeacherProfile` - Teacher information
- `ClassRoom` - Classroom information
- `Subject` - Subject information
- `AttendanceRecord` - Attendance tracking
- `Mark` - Student marks per exam
- `Exam` - Exam definitions
- `Result` - Calculated results

### Administrative Tables
- `FeeRecord` - Fee tracking
- `Book` - Library books
- `BookIssue` - Book issue/return tracking
- `ImportJob` - Data import tracking

## 🏆 Best Practices Implemented

✅ **Code Organization**
- Separation of concerns (Controller-Service-Repository pattern)
- Type-safe with TypeScript
- Modular router structure

✅ **Security**
- RBAC with granular permissions
- JWT token security with rotation
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting on sensitive endpoints
- SQL injection prevention with Prisma
- CORS configured
- Helmet.js headers security

✅ **Logging & Monitoring**
- Winston structured logging
- Daily log file rotation
- Request/response logging
- Error logging with stack traces
- Audit trail for all operations

✅ **Database**
- Prisma ORM with type safety
- Database migrations
- Indexes on foreign keys & frequently queried columns
- Optimized queries with eager loading

✅ **API Design**
- RESTful conventions
- Pagination support on all list endpoints
- Comprehensive filtering & sorting
- Consistent response format
- Swagger documentation
- Error standardization

✅ **Performance**
- Connection pooling with Prisma
- Pagination to limit data transfer
- Efficient database queries
- Proper indexing strategy

## 📖 API Documentation

Full API documentation available at: `http://localhost:4000/api-docs`

Interactive Swagger UI with:
- Endpoint descriptions
- Request/response schemas
- Authentication setup
- Try-it-out functionality

## 🔄 Workflow Examples

### Student Attendance Workflow
1. Teacher logs in
2. Teacher marks attendance (bulk) for class
3. System records attendance with timestamps
4. Student can view their attendance statistics
5. Admin can generate attendance reports

### Marks & Results Workflow
1. Teacher creates marks for exam
2. System validates marks against max marks
3. Admin generates results (auto-calculates grades)
4. Student views their results
5. Audit log tracks all operations

### Fee Management Workflow
1. Accountant creates fee record
2. System tracks fee status (pending/partial/paid)
3. Accountant marks fee as paid
4. Student can view fee statistics
5. Audit log tracks all fee operations

## 🆘 Default Credentials

After seed:
- **Username**: superadmin
- **Password**: SuperAdmin@123

⚠️ **IMPORTANT**: Change immediately after first login!

## 📝 Additional Notes

- All timestamps are in UTC
- Soft deletes can be implemented by adding `deletedAt` field
- Caching layer (Redis) can be added for frequently accessed data
- WebSocket support can be added for real-time updates
- SMS integration for OTP can be configured

## 🤝 Contributing

Follow the project structure and coding standards when adding new features.

---

**Last Updated**: April 2026
**Version**: 1.0.0

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
