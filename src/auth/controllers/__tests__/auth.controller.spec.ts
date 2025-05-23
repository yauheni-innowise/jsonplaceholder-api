import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { Auth } from '../../entities/auth.entity';
import { User } from '../../../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock auth service
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return an access token', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      
      const expectedResult = { access_token: 'test_token' };
      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const expectedResult = { access_token: 'test_token' };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should return the authenticated user profile', () => {
      // Arrange
      const mockUser = { id: 1 } as User;
      const mockAuth: Auth = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed_password',
        user: mockUser,
      };

      // Act
      const result = controller.getProfile(mockAuth);

      // Assert
      expect(result).toEqual(mockAuth);
    });
  });

  describe('test', () => {
    it('should return a test message', async () => {
      // Act
      const result = await controller.test();

      // Assert
      expect(result).toEqual({ message: 'Auth API is working!' });
    });
  });
});
