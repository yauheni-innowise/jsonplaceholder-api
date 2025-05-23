import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TransformInterceptor } from '../transform.interceptor';
import { Observable, of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(async () => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should transform the response data to the standardized format', (done) => {
      // Arrange
      const mockDate = new Date('2025-05-23T14:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const mockData = { id: 1, name: 'Test User' };
      const mockStatusCode = 200;
      
      const mockCallHandler: CallHandler = {
        handle: () => of(mockData),
      };
      
      const mockResponse = {
        statusCode: mockStatusCode,
      };
      
      // Create a properly typed mock ExecutionContext
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn(),
        }),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        getType: jest.fn(),
      } as unknown as ExecutionContext;

      // Act
      const result$: Observable<any> = interceptor.intercept(mockExecutionContext, mockCallHandler);

      // Assert
      result$.subscribe({
        next: (transformedResponse) => {
          expect(transformedResponse).toEqual({
            data: mockData,
            meta: {
              timestamp: mockDate.toISOString(),
              status: mockStatusCode,
            },
          });
          done();
        },
      });
    });

    it('should handle null data', (done) => {
      // Arrange
      const mockData = null;
      const mockStatusCode = 204;
      
      const mockCallHandler: CallHandler = {
        handle: () => of(mockData),
      };
      
      const mockResponse = {
        statusCode: mockStatusCode,
      };
      
      // Create a properly typed mock ExecutionContext
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn(),
        }),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        getType: jest.fn(),
      } as unknown as ExecutionContext;

      // Act
      const result$: Observable<any> = interceptor.intercept(mockExecutionContext, mockCallHandler);

      // Assert
      result$.subscribe({
        next: (transformedResponse) => {
          expect(transformedResponse).toEqual({
            data: null,
            meta: {
              timestamp: expect.any(String),
              status: mockStatusCode,
            },
          });
          done();
        },
      });
    });

    it('should handle array data', (done) => {
      // Arrange
      const mockData = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];
      const mockStatusCode = 200;
      
      const mockCallHandler: CallHandler = {
        handle: () => of(mockData),
      };
      
      const mockResponse = {
        statusCode: mockStatusCode,
      };
      
      // Create a properly typed mock ExecutionContext
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn(),
        }),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        getType: jest.fn(),
      } as unknown as ExecutionContext;

      // Act
      const result$: Observable<any> = interceptor.intercept(mockExecutionContext, mockCallHandler);

      // Assert
      result$.subscribe({
        next: (transformedResponse) => {
          expect(transformedResponse).toEqual({
            data: mockData,
            meta: {
              timestamp: expect.any(String),
              status: mockStatusCode,
            },
          });
          done();
        },
      });
    });
  });
});
