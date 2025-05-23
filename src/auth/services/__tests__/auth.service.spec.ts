import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth } from '../../entities/auth.entity';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { UsersService } from '../../../users/services/users.service';
import { User } from '../../../users/entities/user.entity';
import * as argon2 from 'argon2';

// Mock argon2 to avoid actual hashing in tests
jest.mock('argon2', () => ({
  hash: jest.fn().mockImplementation((password) => `hashed_${password}`),
  verify: jest.fn().mockImplementation((hash, password) => 
    hash === `hashed_${password}` || hash === 'valid_hash'
  ),
}));

// Mock repository factory
const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

// Mock JwtService
const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('test_token'),
});

// Mock UsersService
const mockUsersService = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<Auth>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useFactory: mockRepository,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return an access token', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      
      const mockUser = { id: 1 } as User;
      
      const createdAuth = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        passwordHash: `hashed_${registerDto.password}`,
        user: mockUser
      } as Auth;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(createdAuth);
      jest.spyOn(repository, 'save').mockResolvedValue(createdAuth);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test_token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(repository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        name: registerDto.name,
        passwordHash: `hashed_${registerDto.password}`,
      });
      expect(repository.save).toHaveBeenCalledWith(createdAuth);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: createdAuth.id,
        email: createdAuth.email,
      });
      expect(result).toEqual({ access_token: 'test_token' });
    });

    it('should throw ConflictException when user with email already exists', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };
      
      const mockUser = { id: 1 } as User;
      
      const existingAuth = {
        id: 1,
        email: registerDto.email,
        name: 'Existing User',
        passwordHash: 'some_hash',
        user: mockUser
      } as Auth;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingAuth);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials and return an access token', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const mockUser = { id: 1 } as User;
      
      const existingAuth = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        passwordHash: `hashed_${loginDto.password}`,
        user: mockUser
      } as Auth;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingAuth);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test_token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: existingAuth.id,
        email: existingAuth.email,
      });
      expect(result).toEqual({ access_token: 'test_token' });
    });

    it('should throw UnauthorizedException when user with email does not exist', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      
      const mockUser = { id: 1 } as User;
      
      const existingAuth = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        passwordHash: 'hashed_correct_password', // Different from the login password
        user: mockUser
      } as Auth;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingAuth);
      // Mock argon2.verify to return false for this test
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });
  });

  describe('validateUserById', () => {
    it('should return a user when user with ID exists', async () => {
      // Arrange
      const userId = 1;
      const mockUser = { id: userId } as User;
      
      const existingAuth = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed_password',
        user: mockUser
      } as Auth;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingAuth);

      // Act
      const result = await service.validateUserById(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(existingAuth);
    });

    it('should return null when user with ID does not exist', async () => {
      // Arrange
      const userId = 999;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.validateUserById(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });
  });
});
