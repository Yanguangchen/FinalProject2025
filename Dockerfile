# Multi-stage Dockerfile for Expo (web) production and optional dev

# ----- Base deps (install node modules) -----
FROM node:20-bullseye AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# ----- Build web export -----
FROM node:20-bullseye AS build
WORKDIR /app

# Public env vars used at build-time for Expo web export
# Pass via: --build-arg EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=... (same for MAPTILER)
ARG EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
ARG EXPO_PUBLIC_MAPTILER_KEY
ENV EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=${EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
ENV EXPO_PUBLIC_MAPTILER_KEY=${EXPO_PUBLIC_MAPTILER_KEY}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Produce static web build in ./dist
RUN npm run export:web

# ----- Production image (Nginx) -----
FROM nginx:1.27-alpine AS web
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ----- Optional: Dev target (Expo web dev server) -----
FROM node:20-bullseye AS dev
WORKDIR /app
ENV CI=false
# Enable polling for file change detection in bind-mounts
ENV CHOKIDAR_USEPOLLING=true
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
EXPOSE 8081
CMD ["npm", "run", "web"]


