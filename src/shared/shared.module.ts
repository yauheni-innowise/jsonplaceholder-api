import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './services/seeder.service';
import { DatabaseService } from './services/database.service';
import { User } from '../users/entities/user.entity';
import { Address } from '../users/entities/address.entity';
import { Company } from '../users/entities/company.entity';
import { Geo } from '../users/entities/geo.entity';

/**
 * Module for shared services and utilities across the application
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Company, Geo]),
  ],
  providers: [SeederService, DatabaseService],
  exports: [SeederService, DatabaseService],
})
export class SharedModule {}
