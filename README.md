# Bookstore NestJS Backend

## Overview

The **Bookstore NestJS Backend** is a robust and scalable backend designed for the IyzAds Backend Case. It uses the [NestJS](https://nestjs.com/) framework and follows a microservices architecture, emphasizing modularity and efficiency. The backend consists of two primary microservices:

1. **Auth Service**: Handles user authentication, including login, registration, and role-based access control.
2. **Bookstore Service**: Manages operations related to bookstores and books.

This backend can be easily run locally or deployed to a Kubernetes cluster. Communication between microservices is facilitated by RabbitMQ in an event-driven manner. The architecture supports seamless scalability and fault tolerance.

## Architecture Highlights

- **Microservices**: Auth and Bookstore services are independently scalable and interact over a message broker.
- **Database Integration**: By default, a single PostgreSQL instance is shared, but services can connect to separate databases if needed.
- **Common Library**: Shared utilities are housed in a common library to maintain the DRY principle.
- **Event-driven Design**: RabbitMQ is integrated for service communication.
- **i18n Support**: Provides multilingual support with English and Turkish for validation, error, and success messages.
- **Role-based Access**: Supports roles such as `User`, `Admin`, and `StoreManager`.

### Default Admin User

Default admin credentials are:

- Email: `admin@example.com`
- Password: `admin123`

You can customize these by setting the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Admin and role seeders handle creation during setup.

## Technology Stack

- **Backend**: NestJS v10.x, TypeScript v5.1.3
- **Database**: PostgreSQL
- **Messaging**: RabbitMQ
- **Containerization**: Docker
- **Orchestration**: Kubernetes (K8s)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js v22.12.0
- pnpm (latest version)
- Docker
- Docker Compose

### Running the Project

You can run the entire project with Docker Compose:

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Start the project with Docker Compose:
   ```sh
   pnpm i --recursive
   docker-compose up --build
   ```
   PNPM is required for quicker and recursive install cause each sub apps has its own package.json to decrease app package sizes.
   If you do not have pnpm you can install it via.
   ```sh
   npm i -g pnpm
   ```

This will automatically start all required services, including:

- Auth Service
- Bookstore Service
- PostgreSQL
- RabbitMQ

### Manual Installation

If you prefer to run the services manually:

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start a specific service in development mode:
   ```sh
   pnpm run start:dev --filter <service>
   ```

## Deployment

For production, use Kubernetes:

1. Build Docker images:

   ```sh
   docker build -t <image-name>:<tag> .
   docker push <registry>/<image-name>:<tag>
   ```

2. Apply Kubernetes manifests:
   ```sh
   kubectl apply -f k8s/
   ```

## Docker Compose Configuration

Here is a sample `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  auth-service:
    build:
      context: ./services/auth
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:password@postgres:5432/auth
      - RABBITMQ_URL=amqp://rabbitmq
    depends_on:
      - postgres
      - rabbitmq

  bookstore-service:
    build:
      context: ./services/bookstore
    ports:
      - '3001:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:password@postgres:5432/bookstore
      - RABBITMQ_URL=amqp://rabbitmq
    depends_on:
      - postgres
      - rabbitmq

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - '15672:15672'
      - '5672:5672'
```

### Accessing Services

- **Auth Service**: `http://localhost:3000`
- **Bookstore Service**: `http://localhost:3001`
- **RabbitMQ Management Console**: `http://localhost:15672` (default user: `guest`, password: `guest`)

## Key Features

1. **Standardized Responses**: All endpoints return consistent and structured responses.
2. **Validation**: DTO-based validation ensures data integrity.
3. **Role Management**: Role seeding and management are integrated for simplified administration.
4. **Localization**: Supports multiple languages for better user experience.

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/)
- [Kubernetes Documentation](https://kubernetes.io/)

---

Crafted with ♥ using NestJS.
