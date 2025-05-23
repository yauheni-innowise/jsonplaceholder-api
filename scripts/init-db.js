/**
 * Database initialization script
 * This script runs migrations and seeds the database with initial data
 */
const { execSync } = require('child_process');

/**
 * Execute a command and log the output
 * @param {string} command - Command to execute
 */
function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    if (output) {
      console.log(output.toString());
    }
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Initialize the database
 */
function initializeDatabase() {
  console.log('Starting database initialization...');
  
  // Run migrations
  console.log('Running database migrations...');
  executeCommand('npm run migration:run');
  
  // Seed the database if enabled
  if (process.env.SEED_DATABASE === 'true') {
    console.log('Seeding database with initial data...');
    // The seeding is handled by the SeederService on application startup
    console.log('Database will be seeded on application startup.');
  }
  
  console.log('Database initialization completed successfully.');
}

// Run the initialization
initializeDatabase();
