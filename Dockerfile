# syntax=docker/dockerfile:1

# Philosophizer - Bun Application Dockerfile
# Multi-stage build for optimized production image

# ============================================================================
# Stage 1: Install dependencies
# ============================================================================
FROM oven/bun:1 AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# ============================================================================
# Stage 2: Build stage (if needed for any preprocessing)
# ============================================================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ============================================================================
# Stage 3: Production runtime
# ============================================================================
FROM oven/bun:1-slim AS runtime

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunjs

# Copy application files
COPY --from=builder --chown=bunjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=bunjs:nodejs /app/src ./src
COPY --from=builder --chown=bunjs:nodejs /app/package.json ./
COPY --from=builder --chown=bunjs:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=bunjs:nodejs /app/bunfig.toml ./

# Switch to non-root user
USER bunjs

# Expose port
EXPOSE 1738

# Set production environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun --eval "fetch('http://localhost:1738/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application
CMD ["bun", "run", "src/index.ts"]

