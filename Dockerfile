# samples taken from: https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile

# -------------- Development stage -------------- 
FROM node:25-slim AS development

RUN apt-get update && apt-get install -y

# Install essential development packages
RUN apt-get install -y \
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
    tzdata

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@latest-10

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"



# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV



# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest -g

# remember to put things that don't change much at the top for better caching
# this entrypoint script will copy any file-based secrets into envs
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# Start development server
CMD ["pnpm", "run", "start:dev"]

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
