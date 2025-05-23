import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeederService } from './shared/services/seeder.service';

/**
 * Bootstrap function to run the seeder
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('SeedScript');
  
  try {
    logger.log('Starting seeder...');
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const seederService = app.get(SeederService);
    await seederService.seedUsers();
    
    await app.close();
    logger.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding', error);
    process.exit(1);
  }
}

bootstrap();
