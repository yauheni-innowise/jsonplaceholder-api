import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeederService } from '../shared/services/seeder.service';

/**
 * Standalone script to seed the database with initial data
 * Can be run manually using: npm run seed
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('DatabaseSeeder');
  
  try {
    logger.log('Starting database seeding...');
    
    // Create a standalone application context
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the seeder service
    const seederService = app.get(SeederService);
    
    // Run the seeder
    await seederService.seedUsers();
    
    // Close the application context
    await app.close();
    
    logger.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
bootstrap();
