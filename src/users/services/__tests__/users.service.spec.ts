import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

// Mock repository factory
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const expectedUsers = [{ id: 1, name: 'Test User' }] as User[];
      jest.spyOn(repository, 'find').mockResolvedValue(expectedUsers);

      // Act
      const actualUsers = await service.findAll();

      // Assert
      expect(actualUsers).toEqual(expectedUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when user exists', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = { id: userId, name: 'Test User' } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedUser);

      // Act
      const actualUser = await service.findOne(userId);

      // Assert
      expect(actualUser).toEqual(expectedUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'New User',
        username: 'newuser',
        email: 'new@example.com',
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
      
      const newUser = { id: 1, ...createUserDto } as User;
      
      jest.spyOn(repository, 'create').mockReturnValue(newUser);
      jest.spyOn(repository, 'save').mockResolvedValue(newUser);

      // Act
      const actualUser = await service.create(createUserDto);

      // Assert
      expect(actualUser).toEqual(newUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      // Arrange
      const userId = 1;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      
      const existingUser = { id: userId, name: 'Original Name' } as User;
      const updatedUser = { id: userId, name: 'Updated Name' } as User;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(repository, 'merge').mockReturnValue(updatedUser);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      // Act
      const actualUser = await service.update(userId, updateUserDto);

      // Assert
      expect(actualUser).toEqual(updatedUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(repository.merge).toHaveBeenCalledWith(existingUser, updateUserDto);
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException when trying to update non-existent user', async () => {
      // Arrange
      const userId = 999;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      // Arrange
      const userId = 1;
      const existingUser = { id: userId, name: 'Test User' } as User;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(repository, 'remove').mockResolvedValue({} as User);

      // Act
      await service.remove(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(repository.remove).toHaveBeenCalledWith(existingUser);
    });

    it('should throw NotFoundException when trying to remove non-existent user', async () => {
      // Arrange
      const userId = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });
});
