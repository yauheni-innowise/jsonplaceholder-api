import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Auth } from '../entities/auth.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from '../../users/services/users.service';

/**
 * Service responsible for authentication-related operations
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - Registration data
   * @returns Token information
   */
  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    // Check if user with this email already exists
    const existingAuth = await this.authRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingAuth) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await this.hashPassword(registerDto.password);

    // Create auth record
    const auth = this.authRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      passwordHash,
    });

    // Save auth record
    const savedAuth = await this.authRepository.save(auth);

    // Generate JWT token
    return this.generateToken(savedAuth);
  }

  /**
   * Login a user
   * @param loginDto - Login credentials
   * @returns Token information
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    // Find user by email
    const auth = await this.authRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      auth.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    return this.generateToken(auth);
  }

  /**
   * Validate a user by ID
   * @param id - User ID
   * @returns Auth record or null
   */
  async validateUserById(id: number): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { id } });
  }

  /**
   * Hash a password using argon2
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verify a password against a hash
   * @param hash - Stored password hash
   * @param password - Plain text password to verify
   * @returns Boolean indicating if password is valid
   */
  private async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  /**
   * Generate a JWT token for a user
   * @param auth - Auth record
   * @returns Token information
   */
  private generateToken(auth: Auth): { access_token: string } {
    const payload = { sub: auth.id, email: auth.email };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
