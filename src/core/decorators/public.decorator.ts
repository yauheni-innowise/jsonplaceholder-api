import { SetMetadata } from '@nestjs/common';

/**
 * Key for public route metadata
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public (not requiring authentication)
 * Usage: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
