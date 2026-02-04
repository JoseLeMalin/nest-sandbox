# References:
#   - https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile

# -------------- Development stage -------------- 
FROM node:25-slim AS development

# Install essential development packages as root
RUN apt-get update && apt-get install -y \
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
    dnsutils \
    postgresql-client \
    tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install npm and pnpm globally as root
RUN npm i npm@latest -g && \
    npm install -g pnpm@latest-10

# Set pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set node environment, defaults to production
# docker-compose can override this to development
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Install sudo for development
RUN apt-get update && apt-get install -y sudo && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

# Configure git safe.directory before switching users (as root) || Avoids "detected dubious ownership" errors
RUN git config --system --add safe.directory '*'

# Switch to unprivileged user for security
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node

# Set working directory
WORKDIR /app

# Copy package files (will be owned by root, but readable by node user)
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Install dependencies as node user
RUN pnpm install

# Copy source code with proper ownership
COPY --chown=node:node . .

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT 9229 9230

# Start development server
# CMD ["pnpm", "run", "start:dev"]

# -------------- Production build stage -------------- 
# FROM node:24-alpine3.22 AS builder
# 
# WORKDIR /app
# 
# # Enable corepack and install pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate
# 
# COPY package.json pnpm-lock.yaml ./
# # Before RUN pnpm install --frozen-lockfile
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# 
# COPY . .
# RUN pnpm run build
# 
# --------------  Production stage -------------- 
# FROM node:24-alpine3.22 AS production
# 
# # Install minimal production packages
# RUN apk add --no-cache \
#     ca-certificates \
#     openssl \
#     tzdata \
#     dumb-init
# 
# WORKDIR /app
# 
# # Enable corepack and install pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate
# 
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --prod --frozen-lockfile
# 
# COPY --from=builder /app/dist ./dist
# 
# EXPOSE 3000

# Use dumb-init to handle signals properly
# ENTRYPOINT ["/usr/bin/dumb-init", "--"]
# CMD ["node", "dist/main"]
