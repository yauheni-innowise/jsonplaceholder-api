import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../entities/auth.entity';

/**
 * Controller for handling authentication-related HTTP requests
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * @param registerDto - Registration data
   * @returns Token information
   */
  @ApiOperation({ summary: 'Register new user', description: 'Creates a new user account and returns authentication token' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', schema: { properties: { access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } } })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ access_token: string }> {
    return this.authService.register(registerDto);
  }

  /**
   * Login a user
   * @param loginDto - Login credentials
   * @returns Token information
   */
  @ApiOperation({ summary: 'Login user', description: 'Authenticates a user and returns a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { properties: { access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  /**
   * Protected route to get the authenticated user's profile
   * @param user - The authenticated user
   * @returns The authenticated user's profile
   */
  @ApiOperation({ summary: 'Get user profile', description: 'Returns the profile of the authenticated user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: Auth })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  getProfile(@CurrentUser() user: Auth): Auth {
    return user;
  }

  /**
   * Smoke test endpoint for testing
   * @returns Test message
   */
  @ApiOperation({ summary: 'Test endpoint', description: 'Simple test endpoint to verify Auth API is working' })
  @ApiResponse({ status: 200, description: 'API is working', schema: { properties: { message: { type: 'string', example: 'Auth API is working!' } } } })
  @Public()
  @Get('admin/test')
  async test(): Promise<{ message: string }> {
    return { message: 'Auth API is working!' };
  }
}
