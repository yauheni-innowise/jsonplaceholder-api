import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { createTestApp, generateTestToken } from '../utils/test-app';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: any;
  let authToken: string;

  const mockUser = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
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

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    merge: jest.fn().mockImplementation((user, dto) => ({ ...user, ...dto })),
    remove: jest.fn().mockResolvedValue(undefined),
  };



  beforeEach(async () => {
    // Create test app
    app = await createTestApp();
    
    // Get the repository from the app
    userRepository = app.get(getRepositoryToken(User));
    
    // Override the repository methods with our mocks
    Object.keys(mockUserRepository).forEach(key => {
      userRepository[key] = mockUserRepository[key as keyof typeof mockUserRepository];
    });
    
    // Generate a test JWT token for authentication
    authToken = generateTestToken();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/users', () => {
    it('should return an array of users', () => {
      // Given
      const expectedUsers = [mockUser];
      userRepository.find.mockResolvedValueOnce(expectedUsers);

      // When
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toEqual(expectedUsers);
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', () => {
      // Given
      const userId = 1;
      const expectedUser = mockUser;
      userRepository.findOne.mockResolvedValueOnce(expectedUser);

      // When
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toEqual(expectedUser);
        });
    });

    it('should return 404 when user does not exist', () => {
      // Given
      const userId = 999;
      userRepository.findOne.mockResolvedValueOnce(null);

      // When
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        // Then
        .expect(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', () => {
      // Given
      const createUserDto: CreateUserDto = {
        name: 'New User',
        username: 'newuser',
        email: 'new@example.com',
        address: {
          street: 'New Street',
          suite: 'Suite 456',
          city: 'New City',
          zipcode: '54321',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
        phone: '987-654-3210',
        website: 'newexample.com',
        company: {
          name: 'New Company',
          catchPhrase: 'New Catch Phrase',
          bs: 'New BS',
        },
      };
      
      const expectedUser = { id: 1, ...createUserDto };
      userRepository.create.mockReturnValueOnce(expectedUser);
      userRepository.save.mockResolvedValueOnce(expectedUser);

      // When
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createUserDto)
        .expect(201)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toEqual(expectedUser);
        });
    });

    it('should return 400 when validation fails', () => {
      // Given
      const invalidUserDto = {
        name: 'Invalid User',
        // Missing required fields
      };

      // When
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUserDto)
        // Then
        .expect(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', () => {
      // Given
      const userId = 1;
      const updateUserDto = { name: 'Updated User' };
      const expectedUser = { ...mockUser, ...updateUserDto };
      
      userRepository.findOne.mockResolvedValueOnce(mockUser);
      userRepository.merge.mockReturnValueOnce(expectedUser);
      userRepository.save.mockResolvedValueOnce(expectedUser);

      // When
      return request(app.getHttpServer())
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(200)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toEqual(expectedUser);
        });
    });

    it('should return 404 when trying to update non-existent user', () => {
      // Given
      const userId = 999;
      const updateUserDto = { name: 'Updated User' };
      
      userRepository.findOne.mockResolvedValueOnce(null);

      // When
      return request(app.getHttpServer())
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        // Then
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', () => {
      // Given
      const userId = 1;
      userRepository.findOne.mockResolvedValueOnce(mockUser);

      // When
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        // Then
        .expect(204);
    });

    it('should return 404 when trying to delete non-existent user', () => {
      // Given
      const userId = 999;
      userRepository.findOne.mockResolvedValueOnce(null);

      // When
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        // Then
        .expect(404);
    });
  });

  describe('GET /api/users/admin/test', () => {
    it('should return a test message', () => {
      // When
      return request(app.getHttpServer())
        .get('/api/users/admin/test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toEqual({ message: 'Users API is working!' });
        });
    });
  });
});
