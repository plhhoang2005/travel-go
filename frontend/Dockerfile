# Multi-stage Dockerfile for TravelGO Frontend
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve stage with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
