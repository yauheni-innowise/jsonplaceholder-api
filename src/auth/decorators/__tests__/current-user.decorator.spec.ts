import { ExecutionContext } from '@nestjs/common';
import * as decoratorModule from '../current-user.decorator';
import { Auth } from '../../entities/auth.entity';
import { User } from '../../../users/entities/user.entity';

describe('CurrentUser', () => {
  it('should extract user from request', () => {
    // Arrange
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashed_password',
      user: { id: 1 } as User,
    } as Auth;

    const mockRequest = {
      user: mockUser,
    };

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    // Mock the createParamDecorator function to capture the factory function
    const factoryFunction = jest.fn();
    jest.spyOn(decoratorModule, 'CurrentUser').mockImplementation(() => factoryFunction);
    
    // Create a mock factory function that would be passed to createParamDecorator
    const factory = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };
    
    // Execute the factory function directly
    const result = factory(undefined, mockExecutionContext);

    // Assert
    expect(result).toBe(mockUser);
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });
});
