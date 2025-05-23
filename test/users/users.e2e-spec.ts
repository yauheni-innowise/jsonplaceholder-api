import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/users/entities/user.entity';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: any;

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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    userRepository = moduleFixture.get(getRepositoryToken(User));
    
    await app.init();
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
        .expect(200)
        // Then
        .expect(expectedUsers);
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
        .expect(200)
        // Then
        .expect(expectedUser);
    });

    it('should return 404 when user does not exist', () => {
      // Given
      const userId = 999;
      userRepository.findOne.mockResolvedValueOnce(null);

      // When
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
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
        .send(createUserDto)
        .expect(201)
        // Then
        .expect(expectedUser);
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
        .send(updateUserDto)
        .expect(200)
        // Then
        .expect(expectedUser);
    });

    it('should return 404 when trying to update non-existent user', () => {
      // Given
      const userId = 999;
      const updateUserDto = { name: 'Updated User' };
      
      userRepository.findOne.mockResolvedValueOnce(null);

      // When
      return request(app.getHttpServer())
        .put(`/api/users/${userId}`)
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
        // Then
        .expect(404);
    });
  });

  describe('GET /api/users/admin/test', () => {
    it('should return a test message', () => {
      // When
      return request(app.getHttpServer())
        .get('/api/users/admin/test')
        .expect(200)
        // Then
        .expect({ message: 'Users API is working!' });
    });
  });
});
