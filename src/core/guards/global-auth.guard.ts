import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global authentication guard that protects all routes
 * unless they are explicitly marked as public
 */
@Injectable()
export class GlobalAuthGuard implements CanActivate {
  private readonly jwtAuthGuard: JwtAuthGuard;

  constructor(private readonly reflector: Reflector) {
    this.jwtAuthGuard = new JwtAuthGuard();
  }

  /**
   * Check if the route is accessible
   * @param context - Execution context
   * @returns Boolean indicating if the route is accessible
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access
    if (isPublic) {
      return true;
    }

    // Otherwise, use the JWT auth guard
    return this.jwtAuthGuard.canActivate(context) as Promise<boolean>;
  }
}
