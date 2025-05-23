import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should return health status with timestamp', () => {
      // Arrange
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);

      // Act
      const result = controller.checkHealth();

      // Assert
      expect(result).toEqual({
        status: 'ok',
        timestamp: now.toISOString(),
      });
    });
  });

  describe('test', () => {
    it('should return a test message', () => {
      // Act
      const result = controller.test();

      // Assert
      expect(result).toEqual({
        message: 'Health API is working!',
      });
    });
  });
});
