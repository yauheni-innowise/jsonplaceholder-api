import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Creates a test application for e2e testing
 */
export async function createTestApp(): Promise<INestApplication> {
  // Create a standalone JWT module for testing
  const jwtModule = JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET') || 'testsecret',
      signOptions: { expiresIn: '1h' },
    }),
  });

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PassportModule.register({ defaultStrategy: 'jwt' }), jwtModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  
  // Configure the app with the same settings as in main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.setGlobalPrefix('api');
  
  await app.init();
  
  return app;
}

/**
 * Generates a test JWT token for authentication
 */
export function generateTestToken(payload: any = { sub: 1, email: 'test@example.com' }): string {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'testsecret',
    signOptions: { expiresIn: '1h' },
  });
  
  return jwtService.sign(payload);
}
