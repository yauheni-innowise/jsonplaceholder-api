import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for protecting routes that require authentication
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
