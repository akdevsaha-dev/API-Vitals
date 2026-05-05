# 🐳 Docker Setup Guide

Lumen is fully containerized, providing a seamless local development experience and an easy path to production deployment. This guide walks you through setting up the infrastructure and services using Docker Compose.

## Architecture Overview

Our `docker-compose.yml` defines the following services:

1. **db**: PostgreSQL (PostGIS) container for the primary relational database.
2. **redis**: Redis container used by BullMQ for background job queueing.
3. **api**: The Express API gateway.
4. **worker**: The hybrid Node.js + Go background worker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Getting Started

### 1. Environment Configuration

Ensure you have a `.env` file at the root of the project. Docker Compose uses these variables to configure the database and application containers.

```bash
cp .env.example .env
```

*Example minimal `.env` configuration:*
```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=lumen
```

### 2. Running the Stack

To start the entire application stack (Database, Redis, API, and Worker), run:

```bash
docker-compose up --build -d
```

- `--build`: Forces a rebuild of the Docker images for the API and Worker.
- `-d`: Runs the containers in detached mode (in the background).

### 3. Verifying the Services

You can check the status of your containers using:

```bash
docker-compose ps
```

You should see four running containers:
- `lumen-db` (Port `5432`)
- `lumen-redis` (Port `6379`)
- `lumen-api` (Port `3000`)
- `lumen-worker`

To view the logs of a specific service (e.g., the worker):
```bash
docker-compose logs -f worker
```

## Useful Commands

**Stop all services:**
```bash
docker-compose down
```

**Stop services and remove data volumes:**
*(Warning: This will delete your local database and Redis data)*
```bash
docker-compose down -v
```

**Rebuild a single service (e.g., api):**
```bash
docker-compose up -d --build api
```

## Production Deployment Notes

- The Dockerfiles (located in `apps/api/Dockerfile` and `apps/worker/Dockerfile`) utilize multi-stage builds. This significantly reduces the final image size and ensures that only compiled assets and necessary production dependencies are included.
- The Worker image incorporates both the Node.js runtime and the compiled Go engine binary, allowing IPC execution to work smoothly in the containerized environment.
- Health checks are natively configured for both PostgreSQL and Redis to ensure the API and Worker wait for their dependencies to be fully ready before starting.
