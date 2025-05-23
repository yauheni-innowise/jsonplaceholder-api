import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../jwt.strategy';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../entities/auth.entity';
import { User } from '../../../users/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;
  let configService: ConfigService;

  // Mock services
  const mockAuthService = {
    validateUserById: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key, defaultValue) => {
      if (key === 'JWT_SECRET') {
        return 'test-secret';
      }
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if user exists', async () => {
      // Arrange
      const payload = { sub: 1, email: 'test@example.com' };
      const mockUser = { id: 1, email: 'test@example.com' } as Auth;
      
      jest.spyOn(authService, 'validateUserById').mockResolvedValue(mockUser);

      // Act
      const result = await strategy.validate(payload);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUserById).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      // Arrange
      const payload = { sub: 999, email: 'nonexistent@example.com' };
      
      jest.spyOn(authService, 'validateUserById').mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUserById).toHaveBeenCalledWith(payload.sub);
    });
  });

  describe('constructor', () => {
    it('should use the JWT_SECRET from config service', () => {
      // Assert
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET', 'supersecret');
    });
  });
});
