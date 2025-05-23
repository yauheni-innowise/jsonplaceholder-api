#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
/usr/src/app/scripts/wait-for-it.sh ${DB_HOST}:${DB_PORT} -t 60

# Run database initialization
echo "Initializing database..."
node /usr/src/app/scripts/init-db.js

# Start application in production mode
echo "Starting application..."
node dist/main
