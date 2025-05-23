import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DataSource, Migration } from 'typeorm';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let dataSource: DataSource;
  let configService: ConfigService;

  // Mock the Logger to avoid actual logging during tests
  jest.spyOn(Logger.prototype, 'log').mockImplementation(() => ({}));
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => ({}));

  // Mock the DataSource
  const mockDataSource = {
    showMigrations: jest.fn(),
    runMigrations: jest.fn(),
    undoLastMigration: jest.fn(),
  };

  // Mock the ConfigService
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    dataSource = module.get<DataSource>(DataSource);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mock calls
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should run migrations when not in test environment', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest.spyOn(service, 'runMigrations').mockResolvedValue();

      // Act
      await service.onModuleInit();

      // Assert
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
      expect(service.runMigrations).toHaveBeenCalled();
    });

    it('should not run migrations in test environment', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockReturnValue('test');
      jest.spyOn(service, 'runMigrations').mockResolvedValue();

      // Act
      await service.onModuleInit();

      // Assert
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
      expect(service.runMigrations).not.toHaveBeenCalled();
    });
  });

  describe('runMigrations', () => {
    it('should run migrations when there are pending migrations', async () => {
      // Arrange
      jest.spyOn(dataSource, 'showMigrations').mockResolvedValue(true);
      jest.spyOn(dataSource, 'runMigrations').mockResolvedValue([{ 
        name: 'Migration1',
        id: 1,
        timestamp: 1684835400000
      } as Migration]);
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      await service.runMigrations();

      // Assert
      expect(dataSource.showMigrations).toHaveBeenCalled();
      expect(dataSource.runMigrations).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Running database migrations...');
      expect(loggerSpy).toHaveBeenCalledWith('Successfully ran 1 migrations');
    });

    it('should handle case when no migrations are executed', async () => {
      // Arrange
      jest.spyOn(dataSource, 'showMigrations').mockResolvedValue(true);
      jest.spyOn(dataSource, 'runMigrations').mockResolvedValue([]);
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      await service.runMigrations();

      // Assert
      expect(dataSource.showMigrations).toHaveBeenCalled();
      expect(dataSource.runMigrations).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('No migrations were executed');
    });

    it('should handle case when there are no pending migrations', async () => {
      // Arrange
      jest.spyOn(dataSource, 'showMigrations').mockResolvedValue(false);
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      await service.runMigrations();

      // Assert
      expect(dataSource.showMigrations).toHaveBeenCalled();
      expect(dataSource.runMigrations).not.toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('No pending migrations to run');
    });

    it('should throw error when migration fails', async () => {
      // Arrange
      const mockError = new Error('Migration failed');
      jest.spyOn(dataSource, 'showMigrations').mockRejectedValue(mockError);
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      // Act & Assert
      await expect(service.runMigrations()).rejects.toThrow(mockError);
      expect(loggerSpy).toHaveBeenCalledWith('Error running migrations', mockError);
    });
  });

  describe('revertLastMigration', () => {
    it('should revert the last migration', async () => {
      // Arrange
      jest.spyOn(dataSource, 'undoLastMigration').mockResolvedValue();
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      await service.revertLastMigration();

      // Assert
      expect(dataSource.undoLastMigration).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Reverting last migration...');
      expect(loggerSpy).toHaveBeenCalledWith('Successfully reverted last migration');
    });

    it('should throw error when revert fails', async () => {
      // Arrange
      const mockError = new Error('Revert failed');
      jest.spyOn(dataSource, 'undoLastMigration').mockRejectedValue(mockError);
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      // Act & Assert
      await expect(service.revertLastMigration()).rejects.toThrow(mockError);
      expect(loggerSpy).toHaveBeenCalledWith('Error reverting last migration', mockError);
    });
  });
});
