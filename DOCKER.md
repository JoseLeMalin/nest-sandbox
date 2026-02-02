# Docker Setup Guide

## Overview

This project uses Docker Compose to orchestrate a NestJS application with PostgreSQL. The setup includes:
- **Security**: Non-root user execution
- **Development tools**: Git, vim, nano, curl, wget, PostgreSQL client
- **Debugging**: Node.js debug ports (9229, 9230) exposed
- **Hot-reload**: Code changes reflect immediately via volume mounting
- **Secrets management**: File-based secrets support via entrypoint script

## Quick Start

### Development with Docker Compose

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   docker compose up -d
   ```

3. **View logs:**
   ```bash
   docker compose logs -f app
   ```

4. **Stop services:**
   ```bash
   docker compose down
   ```

5. **Stop and remove volumes (clean slate):**
   ```bash
   docker compose down -v
   ```

## Services

### NestJS Application
- **Container**: `nest-sandbox-app`
- **Base Image**: `node:25-slim`
- **Port**: `3000` (Internal), `6969` (External/Host)
- **Debug Ports**: `9229` (Node.js debugger), `9230` (Tests debugger)
- **URL**: http://localhost:6969
- **Swagger API**: http://localhost:6969/api
- **User**: `node` (non-root for security)
- **Features**:
  - Hot-reload enabled via volume mounting
  - pnpm@latest-10 for package management
  - Full development tooling (git, vim, nano, curl, wget, etc.)
  - PostgreSQL client installed

### PostgreSQL Database
- **Container**: `nest-sandbox-postgres`
- **Port**: `5440` (mapped from internal 5432)
- **Database**: `test`
- **User**: `admin`
- **Password**: `password`
- **Features**:
  - Health checks enabled
  - Persistent data via named volume
  - Auto-initialization via `init-db/01-init.sh`

## Development Workflow

### Using VS Code Dev Containers

1. Open the project in VS Code
2. Press `F1` and select: `Dev Containers: Reopen in Container`
3. VS Code will build and start the containers
4. The app will be available with hot-reload enabled
5. Extensions (ESLint, Prettier, Docker, Jest) will be auto-installed

### Debugging in VS Code

The Dockerfile exposes debug ports for Node.js debugging:

1. **Attach debugger to running container:**
   - Port 9229: Main application
   - Port 9230: Tests

2. **Create `.vscode/launch.json`:**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Docker: Attach to Node",
         "type": "node",
         "request": "attach",
         "port": 9229,
         "address": "localhost",
         "localRoot": "${workspaceFolder}",
         "remoteRoot": "/app",
         "protocol": "inspector"
       }
     ]
   }
   ```

3. **Start app in debug mode:**
   ```bash
   docker compose exec app pnpm run start:debug
   ```

### Manual Development

```bash
# Install dependencies
pnpm install

# Start development server (with hot-reload)
pnpm run start:dev

# Start in debug mode
pnpm run start:debug

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e
```

## Database Management

### Connect to PostgreSQL

```bash
# From host machine using psql
psql -h localhost -p 5440 -U admin -d test

# From within app container
docker compose exec app psql postgresql://admin:password@postgres:5432/test

# Direct connection to postgres container
docker exec -it nest-sandbox-postgres psql -U admin -d test
```

### Database Operations

```bash
# View tables
docker compose exec postgres psql -U admin -d test -c "\dt"

# View users table
docker compose exec postgres psql -U admin -d test -c "SELECT * FROM users;"

# Run SQL file
docker compose exec -T postgres psql -U admin -d test < schema.sql
```

### View Database Logs

```bash
docker compose logs -f postgres
```

### Reset Database

```bash
# Stop containers and remove volumes (deletes all data)
docker compose down -v

# Start fresh (will re-run init-db scripts)
docker compose up -d
```

## File-Based Secrets

The Dockerfile includes an entrypoint script that supports file-based secrets (useful for Docker Swarm or Kubernetes):

```bash
# Example: Load database password from file
docker compose run -e DATABASE_PASSWORD_FILE=/run/secrets/db_password app

# The script will read /run/secrets/db_password and set DATABASE_PASSWORD
```

Any environment variable ending in `_FILE` will be loaded from the specified file path.

## Useful Commands

### Docker Compose Commands

```bash
# Build images
docker compose build

# Rebuild without cache
docker compose build --no-cache

# Rebuild and start
docker compose up --build

# Start in background
docker compose up -d

# Stop containers
docker compose stop

# Restart a specific service
docker compose restart app

# View running containers
docker compose ps

# View resource usage
docker compose stats

# Execute commands in the app container
docker compose exec app pnpm run test
docker compose exec app pnpm run lint

# Execute as root user (for system operations)
docker compose exec --user root app bash
```

### Container Management

```bash
# Shell into app container (as node user)
docker compose exec app bash

# Shell into postgres container
docker compose exec postgres bash

# View container logs
docker compose logs app
docker compose logs postgres

# Follow logs (live)
docker compose logs -f app

# View last 100 lines
docker compose logs --tail=100 app

# Install additional packages (temporary, lost on rebuild)
docker compose exec --user root app apt-get update
docker compose exec --user root app apt-get install -y package-name
```

### Debugging Commands

```bash
# Check environment variables
docker compose exec app env | grep POSTGRES

# Test database connectivity
docker compose exec app psql $DATABASE_URL -c "SELECT version();"

# Check installed Node/npm/pnpm versions
docker compose exec app node --version
docker compose exec app npm --version
docker compose exec app pnpm --version

# Check which user is running
docker compose exec app whoami

# View running processes
docker compose exec app ps aux

# Check network connectivity
docker compose exec app ping postgres
docker compose exec app curl http://localhost:3000

# Test from host machine
curl http://localhost:6969
```

## Production Build

**Note:** Production stages are currently commented out in the Dockerfile. To enable production builds:

1. Uncomment the builder and production stages in `Dockerfile`
2. Build production image:
   ```bash
   docker build --target production -t nest-sandbox:prod .
   ```

3. Run production container:
   ```bash
   docker run -p 3000:3000 --env-file .env nest-sandbox:prod
   ```

## Architecture Details

### Security Features
- **Non-root user**: App runs as `node` user (UID 1000) for security
- **Minimal image**: Using `node:25-slim` reduces attack surface
- **Secrets support**: File-based secrets via entrypoint script
- **No credentials in image**: All secrets via environment variables

### Development Features
- **Hot-reload**: Changes reflect immediately without restart
- **Debug ports**: 9229 and 9230 exposed for debugging
- **Full tooling**: git, vim, nano, curl, wget, PostgreSQL client
- **Package caching**: `node_modules` volume prevents reinstalls

### Performance Optimizations
- **Layer caching**: Dependencies installed before source code
- **Proper .dockerignore**: Excludes unnecessary files from build
- **apt cleanup**: `apt-get clean` reduces image size
- **Volume mounting**: Development uses volumes for instant updates

## Troubleshooting

### Port Already in Use

If ports 6969, 5440, 9229, or 9230 are already in use, update the port mappings in `docker-compose.yaml`:

```yaml
ports:
  - "8080:3000"  # Change external port (app listens on 3000 internally)
  - "9239:9229"  # Change debug port
  - "9240:9230"  # Change debug port for tests
```

### Permission Issues

If you encounter permission errors:

```bash
# Rebuild with proper ownership
docker compose down
docker compose build --no-cache
docker compose up

# Or fix permissions manually
docker compose exec --user root app chown -R node:node /app
```

### Database Connection Issues

1. Ensure PostgreSQL is healthy:
   ```bash
   docker compose ps
   ```
   Status should show "healthy"

2. Check environment variables in the app container:
   ```bash
   docker compose exec app env | grep POSTGRES
   ```

3. Test database connection:
   ```bash
   docker compose exec app psql $DATABASE_URL -c "SELECT 1;"
   ```

4. Check network connectivity:
   ```bash
   docker compose exec app ping postgres
   ```

### Container Won't Start

```bash
# View detailed logs
docker compose logs app

# Check for build errors
docker compose build

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up
```

### pnpm Install Fails

```bash
# Clear pnpm cache and reinstall
docker compose exec app rm -rf node_modules
docker compose exec app pnpm store prune
docker compose exec app pnpm install

# Or rebuild container
docker compose down
docker compose build --no-cache app
docker compose up
```

### Hot-Reload Not Working

1. Ensure volumes are properly mounted in `docker-compose.yaml`
2. Check that `start:dev` uses `--watch` flag
3. Verify file changes are being detected:
   ```bash
   docker compose exec app ls -la /app/src
   ```

### Debug Port Not Working

1. Ensure ports are exposed in Dockerfile:
   ```dockerfile
   EXPOSE 3000 9229 9230
   ```

2. Start app in debug mode:
   ```bash
   docker compose exec app pnpm run start:debug
   ```

3. Check port binding:
   ```bash
   docker compose port app 9229
   ```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Docker Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
- [pnpm Documentation](https://pnpm.io)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
