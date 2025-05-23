FROM node:20-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install netcat for wait-for-it script
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

FROM node:20-alpine As production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install netcat for wait-for-it script
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from development stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/src/shared/data ./dist/shared/data
COPY --from=development /usr/src/app/scripts ./scripts

# Make scripts executable
RUN chmod +x ./scripts/*.sh

# Expose application port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "./scripts/start-prod.sh"]
