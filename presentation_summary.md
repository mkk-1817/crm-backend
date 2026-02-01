# CRM Backend API Presentation Summary

## NestJS Modular Architecture
- **Root Orchestration**: `AppModule` coordinates configuration, global Prisma sharing, and feature modules.
- **Global Prisma Integration**: 
  - `PrismaModule` provides a singleton `PrismaService` (extending `PrismaClient`) shared across the entire application.
  - **Lifecycle Management**: Implements `OnModuleInit` and `OnModuleDestroy` to manage database connections and disconnections automatically during app boot and shutdown.
- **Bootstrap Configuration (`main.ts`)**:
  - **CORS**: Configured with dynamic origins via `FRONTEND_URL`.
  - **Global Validation**: `ValidationPipe` is applied globally with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` for strict type safety.
  - **Swagger Integration**: Automatic OpenAPI spec generation, served at `/api/docs` and exported as `swagger.json`.

## Data Handling & Validation (DTOs)
- **Contract-First Design**: Data Transfer Objects (DTOs) define the shape of requests and responses, acting as the Single Source of Truth for API contracts.
- **Middleware-like Validation**: DTOs work in tandem with `ValidationPipe` to intercept incoming data, ensuring it meets strict criteria before reaching the controller.
- **Runtime Validation**: Leverages `class-validator` decorators (e.g., `@IsNotEmpty()`, `@IsEmail()`, `@IsOptional()`) to enforce business rules.
- **Auto-Transformation**: Incoming payloads are automatically cast to DTO class instances, allowing for instance-level methods and type-safe property access.
- **Swagger Metadata**: DTO fields are decorated with `@ApiProperty()` to provide descriptions, examples, and requirement status in the documentation.

## Database Layer (Prisma)
- **Type-Safe ORM**: Prisma Client provides a fully typed interface for SQLite interactions.
- **Schema Mapping**: Uses `snake_case` for database tables and `camelCase` for application code via `@map` and `@@map` attributes.
- **Error Mapping**: Service layers catch specific Prisma error codes (e.g., `P2025` for "Record not found", `P2002` for "Unique constraint violation") and map them to standard NestJS HTTP Exceptions.
- **Complex Relations**: Handles 1:M (Company-Contact) and M:M (Deal-Contact) relations with cascade deletes and efficient includes.

## API Documentation & Standards (Swagger)
- **Interactive UI**: Shared at `/api/docs`, providing a sandbox for testing all endpoints.
- **Clear Categorization**: Endpoints grouped by `@ApiTags` (Authentication, Users, Companies, Contacts, Deals, Dashboard).
- **Security Definition**: Global Bearer Authentication is configured via `addBearerAuth()`, with specific routes protected by `@ApiBearerAuth()`.
- **Detailed Descriptions**: Every endpoint includes:
    - `@ApiOperation`: Summary and purpose.
    - `@ApiBody` / `@ApiParam` / `@ApiQuery`: Detailed input requirements.
    - `@ApiResponse`: Documented status codes and expected response bodies.

## Authentication & Authorization (AuthN/AuthZ)
- **Dual-Strategy Architecture**: Implements a robust authentication system using `@nestjs/passport` with specialized strategies for different stages of the user lifecycle.
- **Identity Verification (AuthN)**:
    - **Local Strategy**: Used for initial login. Validates `email` and `password` against the database via `AuthService.validateUser`.
    - **Bcrypt Hashing**: Passwords are never stored in plaintext; salted hashing (10 rounds) ensures cryptographic security.
- **Access Control (AuthZ)**:
    - **JWT Strategy**: Used for resource protection. Validates incoming Bearer tokens extracted from the `Authorization` header.
    - **Stateless Identity**: Tokens carry a payload (email, ID, name) signed with a `JWT_SECRET`, allowing the API to verify identity without constant database lookups.
- **Guard Orchestration**:
    - **`JwtAuthGuard`**: A customized guard that extends the base Passport guard to include:
        - **Audit Logging**: Successes and failures (with IP tracking) are logged for security monitoring.
        - **User Context**: Automatically populates `req.user` with valid credentials for use in downstream controllers.
- **Swagger Security**: Protected routes are decorated with `@ApiBearerAuth()`, allowing developers to authorize via the UI using standard Bearer tokens.

## HTTP Status Codes & Error Handling
- **200 OK**: Successful GET, PATCH, and DELETE operations.
- **201 Created**: Successful POST operations (creation of resources).
- **400 Bad Request**: Thrown automatically by `ValidationPipe` when request payloads fail validation.
- **401 Unauthorized**: Thrown by `JwtAuthGuard` when tokens are missing, invalid, or expired.
- **403 Forbidden**: (If implemented) Thrown when an authenticated user lacks permission for a specific resource.
- **404 Not Found**: Thrown when a requested resource does not exist in the database.
- **409 Conflict**: Thrown on unique constraint violations (e.g., duplicate emails).
- **500 Internal Server Error**: Generic fallback for unhandled exceptions.

## Domain Features
- **Authentication**: JWT-based flow with local strategy for login and bearer strategy for resource protection.
- **Dashboard**: Aggregation service using Prisma's count and aggregate capabilities for real-time CRM metrics.
- **Pagination & Sorting**: Standardized across all collection endpoints (`findAll`) using `skip`, `take`, and dynamic `orderBy` clauses.
