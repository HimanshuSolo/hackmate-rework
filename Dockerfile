# =============================================================================
# Multi-stage Dockerfile for Next.js 15 Application with Prisma & Redis
# =============================================================================
# This Dockerfile uses a multi-stage build approach to:
# 1. Minimize final image size
# 2. Improve build caching
# 3. Enhance security with non-root user
# 4. Optimize for production deployment
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies Installation
# -----------------------------------------------------------------------------
# Purpose: Install all production and development dependencies
# Base: Node.js 22 Alpine (minimal Linux distribution)
# Why Node 22: Latest LTS with better performance, compatible with Next.js 15
# -----------------------------------------------------------------------------
FROM node:22-alpine AS deps

# Install system dependencies required for native modules
# libc6-compat: Compatibility layer for glibc-dependent packages
# openssl: Required by Prisma for database connections
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files first (better Docker layer caching)
# If these files don't change, Docker reuses this layer
COPY package.json package-lock.json* ./

# Install dependencies with npm ci (clean install)
# npm ci is faster and more reliable than npm install for CI/CD
# It installs exact versions from package-lock.json
RUN npm ci --legacy-peer-deps

# -----------------------------------------------------------------------------
# Stage 2: Application Builder
# -----------------------------------------------------------------------------
# Purpose: Generate Prisma client and build Next.js application
# This stage includes development dependencies needed for building
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy node_modules from deps stage (leverages Docker cache)
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Configure DNS for Google Fonts API access
# Alpine uses musl libc which needs explicit DNS configuration
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Accept build arguments for environment variables needed during build
# These are required by Clerk and Next.js during static page generation
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG DATABASE_URL
ARG REDIS_URL
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

# Make build args available as environment variables
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
ENV CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
ENV CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# Generate Prisma Client before building Next.js
# This creates the @prisma/client package with database models
RUN npx prisma generate

# Build Next.js application with retry logic for font downloads
# This runs: prisma generate && next build (from package.json)
# Creates optimized production build in .next folder
# With output: 'standalone', creates a minimal .next/standalone folder
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Production Runner
# -----------------------------------------------------------------------------
# Purpose: Create minimal production image with only runtime dependencies
# This stage contains only what's needed to run the application
# Results in smallest possible image size
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security best practices
# Running as non-root prevents potential container breakout vulnerabilities
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets (images, fonts, etc.)
COPY --from=builder /app/public ./public

# Copy standalone build output
# Next.js standalone mode includes only necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets (JS, CSS, images generated during build)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma Client (required for database queries at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema (needed if running migrations or introspection)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nextjs

# Expose port 3000 for the application
EXPOSE 3000

# Health check to monitor container status
# Docker/Kubernetes can use this to restart unhealthy containers
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Next.js production server
# The standalone build includes a minimal Node.js server
CMD ["node", "server.js"]
