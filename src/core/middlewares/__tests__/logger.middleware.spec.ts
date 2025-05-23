import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { LoggerMiddleware } from '../logger.middleware';
import { Request, Response } from 'express';
import { EventEmitter } from 'events';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  // Mock the Logger to avoid actual logging during tests
  jest.spyOn(Logger.prototype, 'log').mockImplementation(() => ({}));

  beforeEach(async () => {
    middleware = new LoggerMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should log HTTP request details on response finish', () => {
      // Arrange
      // Mock Date.now to return predictable values for timing
      const mockStartTime = 1000;
      const mockEndTime = 1100;
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      // Create mock request
      const mockRequest = {
        method: 'GET',
        originalUrl: '/api/users',
        get: jest.fn().mockImplementation((header) => {
          if (header === 'user-agent') {
            return 'Test User Agent';
          }
          return null;
        }),
      } as unknown as Request;

      // Create mock response with EventEmitter to simulate 'finish' event
      const mockResponse = new EventEmitter() as Response;
      mockResponse.statusCode = 200;
      mockResponse.get = jest.fn().mockImplementation((header) => {
        if (header === 'content-length') {
          return '42';
        }
        return null;
      });

      // Create mock next function
      const mockNext = jest.fn();

      // Spy on logger.log
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      middleware.use(mockRequest, mockResponse, mockNext);

      // Simulate response 'finish' event
      mockResponse.emit('finish');

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `GET /api/users 200 42b 100ms - Test User Agent`
      );
    });

    it('should handle missing content-length and user-agent', () => {
      // Arrange
      // Mock Date.now to return predictable values for timing
      const mockStartTime = 1000;
      const mockEndTime = 1050;
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      // Create mock request with no user-agent
      const mockRequest = {
        method: 'POST',
        originalUrl: '/api/auth/login',
        get: jest.fn().mockReturnValue(null),
      } as unknown as Request;

      // Create mock response with no content-length
      const mockResponse = new EventEmitter() as Response;
      mockResponse.statusCode = 401;
      mockResponse.get = jest.fn().mockReturnValue(null);

      // Create mock next function
      const mockNext = jest.fn();

      // Spy on logger.log
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      // Act
      middleware.use(mockRequest, mockResponse, mockNext);

      // Simulate response 'finish' event
      mockResponse.emit('finish');

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `POST /api/auth/login 401 - 50ms - `
      );
    });

    it('should call next function to continue request processing', () => {
      // Arrange
      const mockRequest = {
        method: 'GET',
        originalUrl: '/api/test',
        get: jest.fn().mockReturnValue(''),
      } as unknown as Request;
      const mockResponse = new EventEmitter() as Response;
      mockResponse.get = jest.fn().mockReturnValue(null);
      const mockNext = jest.fn();

      // Act
      middleware.use(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
