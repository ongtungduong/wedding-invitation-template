# syntax=docker/dockerfile:1

# Stage 1: Build static bundle
FROM node:26.13.1-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts wedding.config.json ./
COPY public ./public
COPY src ./src

ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

RUN npm run build

# Stage 2: Unprivileged production Nginx runtime (minimal Alpine slim image)
FROM nginx/nginx-unprivileged:1.31.10-alpine-slim AS runtime

COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
