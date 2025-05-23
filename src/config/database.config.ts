import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Address } from '../users/entities/address.entity';
import { Company } from '../users/entities/company.entity';
import { Geo } from '../users/entities/geo.entity';
import { Auth } from '../auth/entities/auth.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/**
 * Get database configuration based on environment
 * @param configService - NestJS ConfigService
 * @returns TypeORM configuration options
 */
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  
  // PostgreSQL configuration
  const postgresConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_DATABASE', 'jsonplaceholder'),
    entities: [User, Address, Company, Geo, Auth],
    synchronize: nodeEnv === 'development',
    logging: nodeEnv === 'development',
  };
  return postgresConfig;
};
