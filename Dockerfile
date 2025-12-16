# Expo (React Native) dev container
# Runs Metro/Expo dev server inside Docker.

FROM node:18-bullseye-slim

# Native build deps for any node-gyp packages
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=development \
    CI=true \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Expo/Metro ports
EXPOSE 19000 19001 19002 19006 8081

CMD ["npx", "expo", "start", "--clear", "--non-interactive", "--lan", "--port", "19000"]
