import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  // Mock the Logger to avoid actual logging during tests
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => ({}));

  beforeEach(async () => {
    filter = new HttpExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should transform HttpException to the correct response format', () => {
      // Arrange
      const mockDate = new Date('2025-05-23T14:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const mockStatus = HttpStatus.BAD_REQUEST;
      const mockMessage = 'Test error message';
      const mockException = new HttpException(mockMessage, mockStatus);
      
      const mockRequest = {
        url: '/api/test',
        method: 'GET',
      } as Request;
      
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ArgumentsHost;

      // Act
      filter.catch(mockException, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(mockStatus);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: mockStatus,
        timestamp: mockDate.toISOString(),
        path: mockRequest.url,
        method: mockRequest.method,
        message: mockMessage,
      });
    });

    it('should handle exceptions with object response', () => {
      // Arrange
      const mockStatus = HttpStatus.BAD_REQUEST;
      const mockErrorResponse = {
        message: 'Validation error',
        errors: ['Field is required'],
      };
      
      const mockException = new HttpException(mockErrorResponse, mockStatus);
      
      const mockRequest = {
        url: '/api/test',
        method: 'POST',
      } as Request;
      
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ArgumentsHost;

      // Act
      filter.catch(mockException, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(mockStatus);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: mockErrorResponse.message,
      }));
    });

    it('should log the error', () => {
      // Arrange
      const mockStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      const mockMessage = 'Internal server error';
      const mockException = new HttpException(mockMessage, mockStatus);
      mockException.stack = 'Error stack trace';
      
      const mockRequest = {
        url: '/api/test',
        method: 'GET',
      } as Request;
      
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ArgumentsHost;

      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      // Act
      filter.catch(mockException, mockArgumentsHost);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        `${mockRequest.method} ${mockRequest.url} ${mockStatus}`,
        mockException.stack,
        'HttpExceptionFilter'
      );
    });
  });
});
