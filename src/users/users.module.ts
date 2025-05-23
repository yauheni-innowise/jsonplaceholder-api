import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Company } from './entities/company.entity';
import { Geo } from './entities/geo.entity';

/**
 * Module for user-related functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Company, Geo]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
