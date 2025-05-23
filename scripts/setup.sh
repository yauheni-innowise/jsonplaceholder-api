#!/bin/bash

# Setup script for JSONPlaceholder API Clone
# This script helps users quickly set up and run the application

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

# Check if Docker is installed
check_docker() {
  print_message "Checking if Docker is installed..."
  if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
  fi
  print_success "Docker is installed."
}

# Check if Docker Compose is installed
check_docker_compose() {
  print_message "Checking if Docker Compose is installed..."
  if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
  fi
  print_success "Docker Compose is installed."
}

# Create .env file if it doesn't exist
create_env_file() {
  print_message "Checking for .env file..."
  if [ ! -f .env ]; then
    print_message "Creating .env file..."
    cat > .env << EOL
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=jsonplaceholder

# JWT Configuration
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1h

# Application Configuration
PORT=3000
NODE_ENV=development
SEED_DATABASE=true
EOL
    print_success ".env file created."
  else
    print_success ".env file already exists."
  fi
}

# Build and start the application
start_application() {
  print_message "Building and starting the application..."
  docker-compose up --build -d
  
  if [ $? -eq 0 ]; then
    print_success "Application is now running!"
    print_success "API is available at: http://localhost:3000/api"
    print_success "Health check endpoint: http://localhost:3000/api/health"
    print_success "Users endpoint: http://localhost:3000/api/users"
  else
    print_error "Failed to start the application. Please check the logs."
    exit 1
  fi
}

# Main function
main() {
  print_message "Setting up JSONPlaceholder API Clone..."
  
  check_docker
  check_docker_compose
  create_env_file
  start_application
  
  print_success "Setup completed successfully!"
  print_message "To stop the application, run: docker-compose down"
}

# Run the main function
main
