# JSONPlaceholder API Clone

A backend API that replicates the behavior and structure of JSONPlaceholder with extended features including JWT authentication, full REST operations, and containerized deployment.

## Features

- Complete REST API for users resource following the JSONPlaceholder model
- JWT-based authentication with secure password hashing using Argon2
- PostgreSQL database for structured data persistence
- TypeORM for database interaction and migrations
- Docker and Docker Compose for containerized deployment
- Comprehensive test coverage with unit and integration tests
- Standardized API responses with proper error handling
- Environment variable validation and type safety
- Interactive API documentation with Swagger/OpenAPI

## Technology Stack

- **Language**: TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Argon2 hashing
- **Validation**: class-validator, Joi
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI

## Project Structure

The project follows a modular architecture based on NestJS best practices:

```typescript
src/
├── auth/                  # Authentication module
│   ├── controllers/       # Auth controllers
│   ├── decorators/        # Custom decorators
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # Auth entity
│   ├── guards/            # JWT guards
│   ├── services/          # Auth services
│   └── strategies/        # JWT strategy
├── config/                # Configuration module
│   └── validation.schema.ts # Environment validation
├── core/                  # Core module
│   ├── controllers/       # Core controllers (health check)
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Global exception filters
│   ├── guards/            # Global guards
│   ├── interceptors/      # Global interceptors
│   └── middlewares/       # Global middlewares
├── shared/                # Shared module
│   ├── data/              # Initial seed data
│   └── services/          # Shared services (seeder, database)
├── users/                 # Users module
│   ├── controllers/       # User controllers
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # User-related entities
│   └── services/          # User services
├── migrations/            # Database migrations
├── scripts/               # Utility scripts
├── app.module.ts          # Main application module
└── main.ts                # Application entry point
```

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Quick Start

We provide a setup script that checks prerequisites, creates a default `.env` file, and starts the application:

```bash
./scripts/setup.sh
```

### Manual Setup

1. Clone the repository
2. Navigate to the project directory
3. Create a `.env` file (see example in `.env.example`)
4. Start the application using Docker Compose:

```bash
docker-compose up
```

The API will be available at [http://localhost:3000/api](http://localhost:3000/api)

API documentation will be available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get authenticated user profile (protected)

#### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### API Documentation

The API is documented using Swagger/OpenAPI. You can access the interactive documentation at:

```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- Detailed information about all endpoints
- Request and response schemas
- The ability to test endpoints directly from the browser
- Authentication support via the Authorize button

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Data Model

The data model follows the JSONPlaceholder structure:

- **User**: Main entity with personal information
- **Address**: User's address information
- **Company**: User's company information
- **Geo**: Geographical coordinates for the address

## Authentication

The API uses JWT-based authentication with tokens issued upon login. The tokens must be included in the Authorization header for protected endpoints:

```bash
Authorization: Bearer <token>
```

Passwords are securely hashed using the Argon2 algorithm.

## Development Environment

### Local Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (create a `.env` file)

3. Start the development server:

```bash
npm run start:dev
```

### Database Migrations

```bash
# Generate a migration
npm run migration:generate -- <migration-name>

# Run migrations
npm run migration:run

# Revert migrations
npm run migration:revert
```

## Production Deployment

The project includes a production-ready Docker Compose configuration that can be used for deployment to production environments.

### Production Setup

1. Clone the repository on your production server
2. Create a `.env` file with production settings (make sure to set `NODE_ENV=production`)
3. Use the production Docker Compose file to start the application:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Utility Scripts

The project includes several utility scripts in the `scripts/` directory to simplify common tasks:

### Available Scripts

- `setup.sh` - Checks prerequisites (Docker, Docker Compose), creates a default `.env` file, and starts the application
- `dev.sh` - Starts the application in development mode, installing dependencies if needed
- `test.sh` - Runs tests with proper environment setup
- `seed.sh` - Seeds the database with initial data

### Running Scripts

To run any of these scripts, make them executable (if they aren't already) and execute them from the project root:

```bash
# Make a script executable (if needed)
chmod +x scripts/script-name.sh

# Run a script
./scripts/script-name.sh
```

Alternatively, you can run them using bash directly:

```bash
bash scripts/script-name.sh
```

### Security Considerations

For production deployments, make sure to:

- Use a strong, unique JWT secret
- Set appropriate JWT expiration times
- Use a secure database password
- Consider using a reverse proxy like Nginx for SSL termination
- Set up proper logging and monitoring

### Scaling

The application can be scaled horizontally by deploying multiple instances behind a load balancer. The stateless nature of the API makes it well-suited for horizontal scaling.
