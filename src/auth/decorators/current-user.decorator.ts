import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';

/**
 * Decorator to extract the current authenticated user from the request
 * Usage: @CurrentUser() user: Auth
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Auth => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
