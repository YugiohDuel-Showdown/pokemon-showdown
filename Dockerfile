FROM node:20-slim

# Install build tools needed for native modules (better-sqlite3, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies but skip scripts (postinstall runs "node build" which needs source)
RUN npm install --include=optional --ignore-scripts

# Copy the rest of the source
COPY . .

# Rebuild native modules (better-sqlite3, etc.) now that source and build tools are present
RUN npm rebuild

# Create config from example (can be overridden by mounting a custom config)
RUN cp config/config-example.js config/config.js

# Pre-build TypeScript so startup is fast
RUN node build

# Create logs directory expected by the server
RUN mkdir -p logs

EXPOSE 8000

# Pass PORT env var as argument; falls back to 8000
CMD node pokemon-showdown --skip-build ${PORT:-8000}
