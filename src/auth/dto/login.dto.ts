import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user login
 */
export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address for authentication' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
