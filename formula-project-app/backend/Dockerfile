# Formula PM Backend - Multi-stage Production Dockerfile
# Optimized for production deployment with security and performance

# Stage 1: Dependencies and build preparation
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S formulapm -u 1001

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with production optimization
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Production runtime
FROM node:18-alpine AS runtime

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S formulapm -u 1001

# Install runtime dependencies only
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    pangomm \
    libjpeg-turbo \
    freetype \
    dumb-init

# Copy production dependencies from dependencies stage
COPY --from=dependencies --chown=formulapm:nodejs /app/node_modules ./node_modules
COPY --from=dependencies --chown=formulapm:nodejs /app/package*.json ./

# Copy application code
COPY --chown=formulapm:nodejs . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/uploads /app/generated-reports && \
    chown -R formulapm:nodejs /app/logs /app/uploads /app/generated-reports

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5014
ENV SOCKET_PORT=5015

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5014/health', (res) => { \
        if (res.statusCode === 200) process.exit(0); else process.exit(1); \
    }).on('error', () => process.exit(1));"

# Switch to non-root user
USER formulapm

# Expose ports
EXPOSE 5014 5015

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]