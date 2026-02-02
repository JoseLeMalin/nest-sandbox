# Docker Setup Guide

## Quick Start

### Development with Docker Compose

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

## Services

### NestJS Application
- **Container**: `nest-sandbox-app`
- **Port**: `3000`
- **URL**: http://localhost:3000
- **Swagger API**: http://localhost:3000/api

### PostgreSQL Database
- **Container**: `nest-sandbox-postgres`
- **Port**: `5440` (mapped from internal 5432)
- **Database**: `test`
- **User**: `admin`
- **Password**: `password`

## Development Workflow

### Using VS Code Dev Containers

1. Open the project in VS Code
2. Press `F1` and select: `Dev Containers: Reopen in Container`
3. VS Code will build and start the containers
4. The app will be available with hot-reload enabled

### Manual Development

```bash
# Install dependencies
pnpm install

# Start development server (with hot-reload)
pnpm run start:dev

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e
```

## Database Management

### Connect to PostgreSQL

```bash
# Using psql
psql -h localhost -p 5440 -U admin -d test

# Or using docker exec
docker exec -it nest-sandbox-postgres psql -U admin -d test
```

### View Database Logs

```bash
docker-compose logs -f postgres
```

### Reset Database

```bash
# Stop containers and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Useful Commands

### Docker Compose Commands

```bash
# Build images
docker-compose build

# Rebuild and start
docker-compose up --build

# Start in background
docker-compose up -d

# Stop containers
docker-compose stop

# Restart a specific service
docker-compose restart app

# View running containers
docker-compose ps

# Execute commands in the app container
docker-compose exec app pnpm run test
```

### Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs postgres

# Follow logs (live)
docker-compose logs -f app

# Shell into app container
docker-compose exec app sh

# Shell into postgres container
docker-compose exec postgres sh
```

## Production Build

```bash
# Build production image
docker build --target production -t nest-sandbox:prod .

# Run production container
docker run -p 3000:3000 --env-file .env nest-sandbox:prod
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 5440 are already in use, update the port mappings in `docker-compose.yaml`:

```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Database Connection Issues

1. Ensure PostgreSQL is healthy:
   ```bash
   docker-compose ps
   ```

2. Check environment variables in the app container:
   ```bash
   docker-compose exec app env | grep POSTGRES
   ```

3. Test database connection:
   ```bash
   docker-compose exec app sh
   psql $DATABASE_URL
   ```

### Container Won't Start

```bash
# View detailed logs
docker-compose logs app

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```
