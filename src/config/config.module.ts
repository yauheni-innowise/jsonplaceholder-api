import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';

/**
 * Configuration module for handling environment variables
 * with validation and type safety
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
})
export class ConfigModule {}
