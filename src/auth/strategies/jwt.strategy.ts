import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

/**
 * JWT strategy for authentication
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'supersecret'),
    });
  }

  /**
   * Validate the JWT payload
   * @param payload - The JWT payload
   * @returns The authenticated user
   */
  async validate(payload: { sub: number; email: string }): Promise<any> {
    const user = await this.authService.validateUserById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }
    
    return user;
  }
}
