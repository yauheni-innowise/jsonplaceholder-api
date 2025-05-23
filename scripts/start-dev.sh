#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
/usr/src/app/scripts/wait-for-it.sh postgres:5432 -t 60

# Run migrations
echo "Running database migrations..."
npm run migration:run

# Start application in development mode
echo "Starting application..."
npm run start:dev
