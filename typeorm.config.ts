import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Address } from './src/users/entities/address.entity';
import { Company } from './src/users/entities/company.entity';
import { Geo } from './src/users/entities/geo.entity';
import { Auth } from './src/auth/entities/auth.entity';

// Load environment variables from .env file
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'jsonplaceholder'),
  entities: [User, Address, Company, Geo, Auth],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
