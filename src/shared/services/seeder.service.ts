import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { Address } from '../../users/entities/address.entity';
import { Company } from '../../users/entities/company.entity';
import { Geo } from '../../users/entities/geo.entity';
// Import the initial data from the JSON file
import initialData from '../data/users.json';

/**
 * Service responsible for seeding the database with initial data
 */
@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Automatically seed the database when the module initializes
   */
  async onModuleInit(): Promise<void> {
    if (this.configService.get('SEED_DATABASE', 'true') === 'true') {
      await this.seedUsers();
    }
  }

  /**
   * Seed the database with users from JSONPlaceholder
   */
  async seedUsers(): Promise<void> {
    const count = await this.userRepository.count();
    
    if (count > 0) {
      this.logger.log('Database already has users, skipping seeding');
      return;
    }
    
    this.logger.log('Seeding database with initial users...');
    
    try {
      for (const userData of initialData) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }
      
      this.logger.log(`Successfully seeded database with ${initialData.length} users`);
    } catch (error) {
      this.logger.error('Failed to seed database', error);
    }
  }
}
