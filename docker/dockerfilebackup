# command: docker build .
# Use an official Node.js runtime as a base image
# ode:21-alpine3.19
#  /app
# the working directory in the container
# R /app
# 
# all pnpm globally
# m install -g pnpm
# 
#  package.json, pnpm-lock.yaml, and pnpm-workspace.yaml to the working directory
#  package.json ./app
#  pnpm-lock.yaml ./app
# 
# all project dependencies using pnpm
# pm install
# 
#  the rest of the application code to the working directory
#  . .
# 
# d the Next.js application
# pnpm build
# pm prune
# 
# se the port that the application will run on
#  3000
# 
# ne the command to run your application
# pnpm", "dev"]

FROM node:18.17.0
# Set the working directory in the container
WORKDIR /app
# Copy package.json and pnpm-lock.yaml
COPY pnpm-lock.yaml package.json ./
# Install app dependencies using PNPM
RUN npm install -g pnpm
# Install dependencies
RUN pnpm i 
# Copy the application code 
COPY . .
# Build the TypeScript code
#RUN pnpm run build
# Expose the app
EXPOSE 3000
# Start the application
CMD ["pnpm", "start"]