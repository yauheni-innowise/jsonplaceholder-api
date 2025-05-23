import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { Auth } from './entities/auth.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * Module for authentication-related functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'supersecret'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
