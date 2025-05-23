import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalAuthGuard } from '../global-auth.guard';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

// Mock JwtAuthGuard
jest.mock('../../../auth/guards/jwt-auth.guard', () => {
  return {
    JwtAuthGuard: jest.fn().mockImplementation(() => {
      return {
        canActivate: jest.fn(),
      };
    }),
  };
});

describe('GlobalAuthGuard', () => {
  let guard: GlobalAuthGuard;
  let reflector: Reflector;

  // Create a mock execution context
  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<GlobalAuthGuard>(GlobalAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if route is public', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      // Act
      const result = await guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should use JwtAuthGuard if route is not public', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      
      // Get the mocked JwtAuthGuard instance from the GlobalAuthGuard
      const jwtAuthGuard = (guard as any).jwtAuthGuard;
      jest.spyOn(jwtAuthGuard, 'canActivate').mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(jwtAuthGuard.canActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should return false if JwtAuthGuard returns false', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      
      // Get the mocked JwtAuthGuard instance from the GlobalAuthGuard
      const jwtAuthGuard = (guard as any).jwtAuthGuard;
      jest.spyOn(jwtAuthGuard, 'canActivate').mockResolvedValue(false);

      // Act
      const result = await guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(false);
      expect(jwtAuthGuard.canActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });
});
