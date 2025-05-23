import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock users service
  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const expectedUsers: User[] = [
        { id: 1, name: 'User 1' } as User,
        { id: 2, name: 'User 2' } as User,
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedUsers);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      // Arrange
      const userId = 1;
      const expectedUser: User = { id: userId, name: 'User 1' } as User;
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedUser);

      // Act
      const result = await controller.findOne(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 999;
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException(`User with ID ${userId} not found`));

      // Act & Assert
      await expect(controller.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(userId);
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
      
      const expectedUser: User = { id: 1, ...createUserDto } as User;
      jest.spyOn(service, 'create').mockResolvedValue(expectedUser);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      // Arrange
      const userId = 1;
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const expectedUser: User = { id: userId, name: 'Updated User' } as User;
      
      jest.spyOn(service, 'update').mockResolvedValue(expectedUser);

      // Act
      const result = await controller.update(userId, updateUserDto);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it('should throw NotFoundException when trying to update non-existent user', async () => {
      // Arrange
      const userId = 999;
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException(`User with ID ${userId} not found`));

      // Act & Assert
      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      const userId = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      // Act
      await controller.remove(userId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when trying to remove non-existent user', async () => {
      // Arrange
      const userId = 999;
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException(`User with ID ${userId} not found`));

      // Act & Assert
      await expect(controller.remove(userId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });

  describe('test', () => {
    it('should return a test message', async () => {
      // Act
      const result = await controller.test();

      // Assert
      expect(result).toEqual({ message: 'Users API is working!' });
    });
  });
});
