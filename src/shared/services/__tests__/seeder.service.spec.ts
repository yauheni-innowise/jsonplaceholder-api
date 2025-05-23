import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { SeederService } from '../seeder.service';
import { User } from '../../../users/entities/user.entity';
import initialData from '../../data/users.json';

describe('SeederService', () => {
  let service: SeederService;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  // Mock the Logger to avoid actual logging during tests
  jest.spyOn(Logger.prototype, 'log').mockImplementation(() => ({}));
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => ({}));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);

    // Reset mock calls
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call seedUsers when SEED_DATABASE is true', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockReturnValue('true');
      jest.spyOn(service, 'seedUsers').mockResolvedValue();

      // Act
      await service.onModuleInit();

      // Assert
      expect(configService.get).toHaveBeenCalledWith('SEED_DATABASE', 'true');
      expect(service.seedUsers).toHaveBeenCalled();
    });

    it('should not call seedUsers when SEED_DATABASE is false', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockReturnValue('false');
      jest.spyOn(service, 'seedUsers').mockResolvedValue();

      // Act
      await service.onModuleInit();

      // Assert
      expect(configService.get).toHaveBeenCalledWith('SEED_DATABASE', 'true');
      expect(service.seedUsers).not.toHaveBeenCalled();
    });
  });

  describe('seedUsers', () => {
    it('should skip seeding if users already exist', async () => {
      // Arrange
      jest.spyOn(userRepository, 'count').mockResolvedValue(10);
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      await service.seedUsers();

      // Assert
      expect(userRepository.count).toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Database already has users, skipping seeding');
    });

    it('should seed users if database is empty', async () => {
      // Arrange
      jest.spyOn(userRepository, 'count').mockResolvedValue(0);
      jest.spyOn(userRepository, 'create').mockImplementation((userData) => userData as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue({} as User);
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      await service.seedUsers();

      // Assert
      expect(userRepository.count).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledTimes(initialData.length);
      expect(userRepository.save).toHaveBeenCalledTimes(initialData.length);
      expect(loggerSpy).toHaveBeenCalledWith('Seeding database with initial users...');
      expect(loggerSpy).toHaveBeenCalledWith(`Successfully seeded database with ${initialData.length} users`);
    });

    it('should handle errors during seeding', async () => {
      // Arrange
      const mockError = new Error('Database error');
      jest.spyOn(userRepository, 'count').mockResolvedValue(0);
      jest.spyOn(userRepository, 'create').mockImplementation(() => { throw mockError; });
      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      // Act
      await service.seedUsers();

      // Assert
      expect(userRepository.count).toHaveBeenCalled();
      expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to seed database', mockError);
    });
  });
});
