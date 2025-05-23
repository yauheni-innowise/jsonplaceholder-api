import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

/**
 * Service responsible for database operations like migrations
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Run database migrations when the module initializes
   */
  async onModuleInit(): Promise<void> {
    if (this.configService.get('NODE_ENV') !== 'test') {
      await this.runMigrations();
    }
  }

  /**
   * Run database migrations
   * @returns Promise that resolves when migrations are complete
   */
  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Running database migrations...');
      
      const pendingMigrations = await this.dataSource.showMigrations();
      
      if (!pendingMigrations) {
        this.logger.log('No pending migrations to run');
        return;
      }
      
      const migrations = await this.dataSource.runMigrations();
      
      if (migrations.length > 0) {
        this.logger.log(`Successfully ran ${migrations.length} migrations`);
      } else {
        this.logger.log('No migrations were executed');
      }
    } catch (error) {
      this.logger.error('Error running migrations', error);
      throw error;
    }
  }

  /**
   * Revert the last executed migration
   * @returns Promise that resolves when the migration is reverted
   */
  async revertLastMigration(): Promise<void> {
    try {
      this.logger.log('Reverting last migration...');
      
      await this.dataSource.undoLastMigration();
      
      this.logger.log('Successfully reverted last migration');
    } catch (error) {
      this.logger.error('Error reverting last migration', error);
      throw error;
    }
  }
}
