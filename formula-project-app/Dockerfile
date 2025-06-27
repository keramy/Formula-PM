# Formula PM Frontend - Multi-stage Production Dockerfile
# Optimized for production deployment with Nginx serving

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S formulapm -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies with production optimization
RUN npm ci --silent && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime with Nginx
FROM nginx:alpine AS runtime

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S formulapm
RUN adduser -S formulapm -u 1001 -G formulapm

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder --chown=formulapm:formulapm /app/dist /usr/share/nginx/html

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R formulapm:formulapm /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# Set environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

# Expose port
EXPOSE 3003

# Switch to non-root user
USER formulapm

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]