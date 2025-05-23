#!/bin/bash

# Development script for JSONPlaceholder API Clone
# This script helps developers quickly start the application in development mode

# Print colorful messages
print_message() {
  echo -e "\033[1;34m>> $1\033[0m"
}

print_success() {
  echo -e "\033[1;32m>> $1\033[0m"
}

print_error() {
  echo -e "\033[1;31m>> $1\033[0m"
}

# Start the application in development mode
start_dev() {
  print_message "Starting the application in development mode..."
  
  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    print_message "Installing dependencies..."
    npm install
  fi
  
  # Start the application
  npm run start:dev
}

# Main function
main() {
  print_message "Starting JSONPlaceholder API Clone in development mode..."
  start_dev
}

# Run the main function
main
