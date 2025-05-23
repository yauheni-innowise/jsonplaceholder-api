import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from './config/config.module';
import { getDatabaseConfig } from './config/database.config';

/**
 * Main application module that configures database connection
 * and imports all feature modules
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
    }),
    UsersModule,
    AuthModule,
    CoreModule,
    SharedModule,
  ],
})
export class AppModule {}
