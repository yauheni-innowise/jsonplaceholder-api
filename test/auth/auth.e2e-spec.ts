import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from '../../src/auth/entities/auth.entity';
import { User } from '../../src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { createTestApp, generateTestToken } from '../utils/test-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authRepository: any;
  let userRepository: any;
  let jwtService: JwtService;
  let authToken: string;

  const mockUser = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    address: {
      street: 'Test Street',
      suite: 'Suite 123',
      city: 'Test City',
      zipcode: '12345',
      geo: {
        lat: '40.7128',
        lng: '-74.0060',
      },
    },
    phone: '123-456-7890',
    website: 'example.com',
    company: {
      name: 'Test Company',
      catchPhrase: 'Test Catch Phrase',
      bs: 'Test BS',
    },
  };

  const mockAuth = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    user: mockUser,
  };

  const mockAuthRepository = {
    findOne: jest.fn().mockResolvedValue(mockAuth),
    create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    save: jest.fn().mockImplementation((auth) => Promise.resolve(auth)),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mock.jwt.token'),
  };

  beforeEach(async () => {
    // Create test app
    app = await createTestApp();
    
    // Get the repositories and services from the app
    authRepository = app.get(getRepositoryToken(Auth));
    userRepository = app.get(getRepositoryToken(User));
    jwtService = app.get(JwtService);
    
    // Override the repository methods with our mocks
    Object.keys(mockAuthRepository).forEach(key => {
      authRepository[key] = mockAuthRepository[key as keyof typeof mockAuthRepository];
    });
    
    Object.keys(mockUserRepository).forEach(key => {
      userRepository[key] = mockUserRepository[key as keyof typeof mockUserRepository];
    });
    
    // Mock the JWT service sign method
    jest.spyOn(jwtService, 'sign').mockImplementation(() => 'mock.jwt.token');
    
    // Generate a test JWT token for authentication
    authToken = generateTestToken();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should handle registration with existing email', () => {
      // Given
      const registerDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };
      
      // Mock that the email already exists (409 Conflict)
      authRepository.findOne.mockResolvedValueOnce({ email: registerDto.email });

      // When
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(409);
    });

    it('should return 400 when validation fails during registration', () => {
      // Given
      const invalidRegisterDto = {
        name: 'New User',
        // Missing required fields
      };

      // When
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(invalidRegisterDto)
        // Then
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should handle login validation errors', () => {
      // Given
      const loginDto = {
        // Missing required fields
      };

      // When
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(400);
    });

    it('should return 401 when credentials are invalid', () => {
      // Given
      const loginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };
      
      authRepository.findOne.mockResolvedValueOnce(null);

      // When
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        // Then
        .expect(401);
    });

    it('should return 400 when validation fails during login', () => {
      // Given
      const invalidLoginDto = {
        // Missing required fields
      };

      // When
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(invalidLoginDto)
        // Then
        .expect(400);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 when not authenticated', () => {
      // When
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        // Then
        .expect(401);
    });

    it('should return 401 when not authenticated', () => {
      // When
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        // Then
        .expect(401);
    });
  });
});
