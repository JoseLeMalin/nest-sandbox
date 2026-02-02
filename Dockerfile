# Development stage
FROM node:20-alpine AS development

# Install essential development packages
RUN apk add --no-cache \
    git \
    curl \
    wget \
    bash \
    vim \
    nano \
    ca-certificates \
    openssl \
    openssh-client \
    iproute2 \
    procps \
    util-linux \
    bind-tools \
    postgresql-client \
    tzdata

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "run", "start:dev"]

# Production build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install minimal production packages
RUN apk add --no-cache \
    ca-certificates \
    openssl \
    tzdata \
    dumb-init

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]
