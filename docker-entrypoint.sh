#!/bin/sh
# =============================================================================
# Docker Entrypoint Script
# =============================================================================
# Purpose: Perform runtime initialization before starting the application
# This script runs database migrations and other startup tasks
# =============================================================================

set -e

echo "🚀 Starting Hackmate application..."

if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "⏳ Waiting for PostgreSQL to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"
echo "� Running database migrations..."
npx prisma migrate deploy

echo "✅ Database ready!"

echo "🎯 Starting Next.js server..."
# Execute the main command (passed as arguments to this script)
exec "$@"
