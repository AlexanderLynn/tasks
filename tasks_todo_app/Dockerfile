ARG BUILD_FROM=node:24-alpine
FROM ${BUILD_FROM} AS backend-builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm ci && npm cache clean --force

# Copy backend source code
COPY backend/src ./src

# Build TypeScript
RUN npm run build

# Frontend build stage
FROM node:24-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy frontend source
COPY frontend/. .
RUN npm run build

# Final stage - combine everything
FROM node:24-alpine

# Install nginx and other dependencies
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    tini \
    jq

# Set working directory for backend
WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built backend from builder
COPY --from=backend-builder /app/dist ./dist

# Copy source files for migration scripts
COPY --from=backend-builder /app/src ./src

# Create data directory for SQLite
RUN mkdir -p /data && chmod 777 /data

# Copy frontend build to nginx
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 8080 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Copy run script
COPY run.sh /run.sh
RUN chmod +x /run.sh

# Use tini as entrypoint to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start nginx and the application via run script
CMD ["/run.sh"]
